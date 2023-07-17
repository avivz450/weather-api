import express from 'express';
import cors from 'cors';
import { urlNotFound } from '../middlewares/error.handler';
import attachRequestId from '../middlewares/attach_request_id';
import weatherConditionsRouter from '../routes/weather-conditions';
import fs from 'fs';
import logger from '@ajar/marker';
import setDoneErrorMethods from "../middlewares/set_done_error";


class App {
  private readonly app: express.Application;

  constructor() {
    this.app = express();
    this.configEnvVariables();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorMiddlewares();
  }

  private configEnvVariables() {
    const appConfig = fs.readFileSync('./app-config.json', 'utf8');
    const envVariables = JSON.parse(appConfig);
    process.env = { ...process.env, ...envVariables };
    global.logger = logger;
  }

  private initializeMiddlewares() {
    this.app.use(attachRequestId);
    this.app.use(setDoneErrorMethods);
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use(`${process.env.API_PATH}`, weatherConditionsRouter);
  }

  private initializeErrorMiddlewares() {
    this.app.use(urlNotFound);
  }

  public async start() {
    const port = Number(process.env.PORT);
    const host = process.env.HOST as string;
    this.app.listen(port, host, () => {
      logger.magenta('API is live on', `✨⚡  http://${host}:${port} ✨⚡`);
    });
  }
}

const app = new App();
export default app;
