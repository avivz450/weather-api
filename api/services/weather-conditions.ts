import { makeHttpRequest } from "../utilities/http-request";
import { ConditionInterval, WeatherCondition, WeatherForecast } from "../types/weatherCondition";
import {ValidationError} from "../modules/validation-error";

export class WeatherConditionsService {
  private validOperators = ["AND", "OR"];
  private weatherParameters = ["temperature","humidity","windSpeed","rainIntensity"]

  async getConditionsTimeline(correlationId: string, location: string, rule: string, operator: string = "AND"): Promise<ConditionInterval[]> {
    const methodName = 'WeatherConditionsService/getConditionsTimeline';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj({ location, rule, operator }, correlationId, `${methodName} - input parameters:`);

    try {
      logger.verbose(correlationId, `${methodName} - calling WeatherConditionsService/validateInput`);
      this.validateInput(correlationId, location, rule, operator);

      logger.verbose(correlationId, `${methodName} - calling WeatherConditionsService/convertToConditionArr`);
      const conditionsArr: WeatherCondition[] = this.convertToConditionArr(correlationId, rule);

      const requestParams = {
        apikey: process.env["WEATHER_API_KEY"],
        location,
        fields: conditionsArr.map(condition => condition.field).join(","),
        timesteps: "1h",
        units: "metric",
        startTime: "now",
        endTime: "nowPlus3d"
      };
      logger.verbose(correlationId, `${methodName} - calling Utilities/makeHttpRequest`);
      const response = await makeHttpRequest(correlationId, "https://api.tomorrow.io/v4/timelines", "GET", requestParams);
      const weatherForecast: WeatherForecast[] = response.data.timelines[0].intervals;

      logger.verbose(correlationId, `${methodName} - calling Utilities/createConditionIntervals`);
      const timeline: ConditionInterval[] = this.createConditionIntervals(correlationId, weatherForecast, conditionsArr, operator);

      logger.obj(timeline, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);
      return timeline;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  private validateInput(correlationId: string, location: string, rule: string, operator: string): void {
    const methodName = 'WeatherConditionsService/validateInput';
    logger.verbose(correlationId, `${methodName} - start`);

    const validationErrors: string[] = [];
    const locationPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

    if (!this.validOperators.includes(operator)) {
      validationErrors.push(`operator must be one of: ${this.validOperators.join(", ")}`);
    }

    if (!locationPattern.test(location)) {
      validationErrors.push('location must be in the format "(double),(double)"');
    }

    const conditions = rule.split(",");
    const conditionPattern = new RegExp(`^(${this.weatherParameters.join("|")})(>|<)(-?\\d+)$`);

    for (const condition of conditions) {
      if (!conditionPattern.test(condition)) {
        validationErrors.push('each condition must be in the format "(field)(operator)(integer)"');
        break;
      }
    }

    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join(', ');
      logger.err(correlationId, `VALIDATION_ERROR: ${errorMessage}`);
      throw new ValidationError(errorMessage);
    }

    logger.verbose(correlationId, `${methodName} - end`);
  }

  private convertToConditionArr(correlationId: string, rule: string): WeatherCondition[] {
    const methodName = 'WeatherConditionsService/convertToConditionArr';
    logger.verbose(correlationId, `${methodName} - start`);

    const conditions: WeatherCondition[] = [];

    const ruleParts = rule.split(',');
    for (const part of ruleParts) {
      const conditionPattern = new RegExp(`^(${this.weatherParameters.join("|")})(>|<)(-?\\d+)$`);
      const match = part.match(conditionPattern);
      const [, field, operator, value] = match;
      const condition: WeatherCondition = { field, operator, value: Number(value) };
      conditions.push(condition);
    }

    logger.verbose(correlationId, `${methodName} - end`);
    return conditions;
  }

  private createConditionIntervals(correlationId: string, weatherForecasts: WeatherForecast[], conditionsArr: WeatherCondition[], operator: string): ConditionInterval[] {
    const methodName = 'WeatherConditionsService/createConditionIntervals';
    logger.verbose(correlationId, `${methodName} - start`);

    const result: ConditionInterval[] = [];
    let lastConditionInterval: ConditionInterval;
    let nextIntervalStartTime: string = weatherForecasts[0].startTime;

    for (const forecast of weatherForecasts) {
      const metConditionsArr = conditionsArr
          .filter(condition => {
            const forecastValue = forecast.values[condition.field];
            return condition.operator === ">" ? forecastValue > condition.value : forecastValue < condition.value;
          });

      const condition_met =
          (operator === "OR" && metConditionsArr.length > 0) ||
          (operator === "AND" && metConditionsArr.length === conditionsArr.length);

      if (lastConditionInterval && lastConditionInterval.condition_met !== condition_met) {
        result.push({
          startTime: nextIntervalStartTime,
          endTime: lastConditionInterval.endTime,
          condition_met: lastConditionInterval.condition_met,
        });

        nextIntervalStartTime = forecast.startTime;
      }

      lastConditionInterval = {
        startTime: forecast.startTime,
        endTime: forecast.startTime,
        condition_met
      };
    }

    if (lastConditionInterval && nextIntervalStartTime !== lastConditionInterval.startTime) {
      result.push({
        startTime: nextIntervalStartTime,
        endTime: lastConditionInterval.endTime,
        condition_met: lastConditionInterval.condition_met,
      });
    }

    logger.verbose(correlationId, `${methodName} - end`);
    return result;
  }
}

const weatherConditionsService = new WeatherConditionsService();
export { weatherConditionsService };
