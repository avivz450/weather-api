import express from 'express';
import cors from 'cors';
import { urlNotFound } from '../middlewares/error.handler';
import attachRequestId from '../middlewares/attach_request_id';
import ticketRouter from '../routes/ticket';
import fs from 'fs';
import logger from '@ajar/marker';
import setDoneErrorMethods from "../middlewares/set_done_error";
import {ticketMongoProvider} from "../providers/mongo-provider/ticket";



class App {
  private readonly app: express.Application;

  constructor() {
    this.app = express();
    this.configEnvVariables();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorMiddlewares();
  }

  private async connectMongoDB() {
    const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
    const dbName = 'ticket_service';
    await ticketMongoProvider.connect(mongoUrl, dbName);
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
    this.app.use(`${process.env.API_PATH}/ticket`, ticketRouter);
  }

  private initializeErrorMiddlewares() {
    this.app.use(urlNotFound);
  }

  public async start() {
    const port = Number(process.env.PORT);
    const host = process.env.HOST as string;
    await this.connectMongoDB();
    this.app.listen(port, host, () => {
      logger.magenta('API is live on', `✨⚡  http://${host}:${port} ✨⚡`);
    });
  }
}

const app = new App();
export default app;
