import express from 'express';
import cors from 'cors';
import { urlNotFound } from '../middlewares/error.handler';
import attachRequestId from '../middlewares/attach_request_id';
import accountRouter from '../routes/account';
import mongoose from 'mongoose';
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
    this.connectMongoDB();
  }

  private configEnvVariables() {
    const appConfig = fs.readFileSync('./app-config.json', 'utf8');
    const envVariables = JSON.parse(appConfig);
    process.env = { ...process.env, ...envVariables };
    global.logger = logger;
  }

  private connectMongoDB() {
    mongoose.set("strictQuery", false);
    mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.DB_NAME}`)
        .then(() => {
          logger.info('Connected to MongoDB');
        })
        .catch((error) => {
          logger.err('Failed to connect to MongoDB:', error);
          process.exit(1);
        });
  }

  private initializeMiddlewares() {
    this.app.use(attachRequestId);
    this.app.use(setDoneErrorMethods);
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use(`${process.env.API_PATH}/account`, accountRouter);
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
