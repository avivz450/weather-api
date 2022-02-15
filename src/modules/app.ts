import path from 'path';
import express, { Application } from 'express';
import cors from 'cors';
import log from '@ajar/marker';
import { errorLogger, errorResponse, printError, urlNotFound } from '../middlewares/error.handler.js';
import authenticateRequest from "../middlewares/authentication.middleware.js";
import logger from '../middlewares/logger.middleware.js';
import attachRequestId from '../middlewares/attachRequestId.middleware.js';
import accountRouter from '../routes/account.router.js';
import individualAccountRouter from '../routes/IndividualAccount.router.js';
import businessAccountRouter from '../routes/businessAccount.router.js';
import familyAccountRouter from '../routes/familyAccount.router.js';
import fs from 'fs';
import { enforceIdempotency } from '../middlewares/idempotency.middleware.js';

const { PORT = 8080, HOST = 'localhost' } = process.env;

class App {
  private readonly app: Application;

  readonly API_PATH = '/api/account';

  static readonly ERRORS_LOG_PATH = path.join(process.cwd(), 'logs', 'errors.log');

  static readonly REQUESTS_LOG_PATH = path.join(process.cwd(), 'logs', 'requests.log');

  constructor() {
    this.configEnvVariables();
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorMiddlewares();
  }

  private configEnvVariables() {
    process.env = JSON.parse(fs.readFileSync('./app-config.json', 'utf8'));
  }

  private initializeMiddlewares() {
    this.app.use(attachRequestId);
    this.app.use(cors());
    this.app.use(logger(App.REQUESTS_LOG_PATH));
    this.app.use(express.json());
    this.app.use(authenticateRequest);
    this.app.use(enforceIdempotency);

  }

  private initializeRoutes() {
    this.app.use(`${this.API_PATH}/individual`, individualAccountRouter.router);
    this.app.use(`${this.API_PATH}/business`, businessAccountRouter.router);
    this.app.use(`${this.API_PATH}/family`, familyAccountRouter.router);
    this.app.use(`${this.API_PATH}`, accountRouter.router);
  }

  private initializeErrorMiddlewares() {
    this.app.use(urlNotFound);
    this.app.use(printError);
    this.app.use(errorLogger(App.ERRORS_LOG_PATH));
    this.app.use(errorResponse);
  }

  async start() {
    this.app.listen(Number(PORT), HOST as string, () => {
      log.magenta('api is live on', ` ✨⚡  http://${HOST}:${PORT} ✨⚡`);
    });
  }
}

const app = new App();
export default app;
