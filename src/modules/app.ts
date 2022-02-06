import path from 'path';
import express, { Application } from 'express';
import cors from 'cors';
import log from '@ajar/marker';
import {
  errorLogger,
  errorResponse,
  printError,
  urlNotFound
} from '../middlewares/error.handler.js';
import { logger } from '../middlewares/logger.middleware.js';
import { attachRequestId } from '../middlewares/attachRequestId.middleware.js';

const { cwd } = process;
const { PORT = 8080, HOST = 'localhost', DB_URI } = process.env;

class App {
  static readonly API_PATH = '/api';
  static readonly REQUESTS_LOG_PATH = path.join(cwd(), 'logs', 'requests.log');
  static readonly ERRORS_LOG_PATH = path.join(cwd(), 'logs', 'errors.log');

  private readonly app: Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorMiddlewares();
  }

  private initializeMiddlewares() {
    this.app.use(attachRequestId);
    this.app.use(cors());
    this.app.use(logger(App.REQUESTS_LOG_PATH));
    this.app.use(express.json());
  }

  private initializeRoutes() {
      
  }

  private initializeErrorMiddlewares() {
    this.app.use(urlNotFound);
    this.app.use(printError);
    this.app.use(errorLogger(App.ERRORS_LOG_PATH));
    this.app.use(errorResponse);
  }

  async start() {
    this.app.listen(Number(PORT), HOST as string, () => {
      log.magenta('api is live on', ` ✨ ⚡  http://${HOST}:${PORT} ✨ ⚡`);
    });
  }
}

const app = new App();

export default app;
