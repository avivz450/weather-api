import {makeHttpRequest} from "../utilities/http-request";
import {ConditionInterval, WeatherCondition, WeatherForecast} from "../types/weatherCondition";

export class WeatherConditionsService {
  validOperators = ["AND", "OR"]

  async getConditionsTimeline(correlationId: string, location: string, rule: string, operator: string = "AND"): Promise<ConditionInterval[]> {
    const methodName = 'WeatherConditionsService/getConditionsTimeline';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj({location, rule, operator}, correlationId, `${methodName} - input parameters:`);

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
      }
      logger.verbose(correlationId, `${methodName} - calling Utilities/makeHttpRequest`);
      const response = await makeHttpRequest("https://api.tomorrow.io/v4/timelines", "GET", requestParams);
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

  validateInput(correlationId: string, location: string, rule: string, operator: string): void {
    const validationErrors: string[] = [];
    const locationPattern = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

    if (!this.validOperators.includes(operator)) {
      validationErrors.push(`operator must be one of: ${this.validOperators.join(", ")}`);
    }

    if (!locationPattern.test(location)) {
      validationErrors.push('location must be in the format "(double),(double)"');
    }

    const conditions = rule.split(",");
    const conditionPattern = /^(temperature|humidity|windSpeed|rainIntensity)(>|<)(-?\d+)$/;

    for (const condition of conditions) {
      if (!conditionPattern.test(condition)) {
        validationErrors.push('each rule must be in the format "(condition)(operator)(integer)"');
        break
      }
    }

    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join(', ');
      logger.err(correlationId, `Validation Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  private convertToConditionArr(correlationId: string, rule: string): WeatherCondition[] {
    const conditions: WeatherCondition[] = [];

    const ruleParts = rule.split(',');
    for (const part of ruleParts) {
      const regex = /^(humidity|temperature|windSpeed|rainIntensity)([<>])(\d+)$/;
      const match = part.match(regex);
      const [, field, operator, value] = match;
      const rule: WeatherCondition = {field, operator, value: Number(value)}
      conditions.push(rule);
    }

    return conditions;
  }

  private createConditionIntervals(correlationId: string, weatherForecasts: WeatherForecast[], conditionsArr: WeatherCondition[], operator: string): ConditionInterval[] {
    const result: ConditionInterval[] = [];
    let lastConditionInterval: ConditionInterval;
    let nextIntervalStartTime: string = weatherForecasts[0].startTime;

    for (const forecast of weatherForecasts) {
      const metConditionsFields: string[] = conditionsArr
          .filter(condition => {
            const forecastValue = forecast.values[condition.field];
            return condition.operator === ">" ? forecastValue > condition.value : forecastValue < condition.value;
          })
          .map(condition => condition.field);

      const condition_met =
          (operator === "OR" && metConditionsFields.length > 0) ||
          (operator === "AND" && metConditionsFields.length === conditionsArr.length);

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

    if (nextIntervalStartTime !== lastConditionInterval.startTime) {
      result.push({
        startTime: nextIntervalStartTime,
        endTime: lastConditionInterval.endTime,
        condition_met: lastConditionInterval.condition_met,
      });
    }

    return result;
  }
}

const weatherConditionsService = new WeatherConditionsService();
export { weatherConditionsService };
