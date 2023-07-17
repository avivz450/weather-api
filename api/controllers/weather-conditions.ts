import { RequestHandler } from 'express';
import { weatherConditionsService } from '../services/weather-conditions';
import {check, validationResult} from "express-validator";
import {HttpStatusCodes} from "../types/enums";
import {ConditionInterval} from "../types/weatherCondition";

export class WeatherConditionsController {
  getConditionsTimeline: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'WeatherConditionsController/getConditionsTimeline';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      logger.verbose(req.correlationId, `${methodName} - calling WeatherConditionsController/validateRequest`);
      await this.validateRequest(req);

      logger.verbose(req.correlationId, `${methodName} - calling WeatherConditionsService/getConditionsTimeline`);
      const timeline: ConditionInterval[] = await weatherConditionsService.getConditionsTimeline(req.correlationId, req.query["location"] as string, req.query["rule"] as string, req.query["operator"] as string);
      logger.obj(timeline, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done({timeline});
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_GET_TIMELINE';
      return res.error(err, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  validateRequest = async (req: any): Promise<void> => {
    const validationRules = [
      check('location').notEmpty().withMessage('Location is required'),
      check('rule').notEmpty().withMessage('Rule is required')
    ];

    await Promise.all(validationRules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new Error(`Validation error: ${errorMessages.join(', ')}`);
    }
  };
}

const weatherConditionsController = new WeatherConditionsController();
export { weatherConditionsController };
