import { RequestHandler } from 'express';
import { weatherConditionsService } from '../services/weather-conditions';
import {ConditionInterval} from "../types/weatherCondition";

export class WeatherConditionsController {
  getConditionsTimeline: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'WeatherConditionsController/getConditionsTimeline';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      logger.verbose(req.correlationId, `${methodName} - calling WeatherConditionsService/getConditionsTimeline`);
      const timeline: ConditionInterval[] = await weatherConditionsService.getConditionsTimeline(req.correlationId, req.query["location"] as string, req.query["rule"] as string, req.query["operator"] as string);
      logger.obj(timeline, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done({timeline});
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_GET_TIMELINE';
      return res.error(err);
    }
  };
}

const weatherConditionsController = new WeatherConditionsController();
export { weatherConditionsController };
