export interface WeatherForecast {
  startTime: string;
  values: {
    humidity?: number;
    rainIntensity?: number;
    temperature?: number;
    windSpeed?: number;
  };
}

export interface ConditionInterval {
  startTime: string;
  endTime: string;
  condition_met: boolean
}

export interface WeatherCondition {
  field: string;
  operator: string;
  value: number
}