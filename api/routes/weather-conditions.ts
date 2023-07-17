import { Router } from 'express';
import {weatherConditionsController} from '../controllers/weather-conditions';
import {validateGetTimeline} from "../middlewares/validate-get-timeline";

class WeatherConditionsRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/',validateGetTimeline, weatherConditionsController.getConditionsTimeline);
  }

  public getRouter() {
    return this.router;
  }
}

const weatherConditionsRouter = new WeatherConditionsRouter();

export default weatherConditionsRouter.getRouter();
