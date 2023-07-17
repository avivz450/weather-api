import { Router } from 'express';
import {weatherConditionsController} from '../controllers/weather-conditions';

class WeatherConditionsRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', weatherConditionsController.getConditionsTimeline);
  }

  public getRouter() {
    return this.router;
  }
}

const weatherConditionsRouter = new WeatherConditionsRouter();

export default weatherConditionsRouter.getRouter();
