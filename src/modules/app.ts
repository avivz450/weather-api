import * as express from 'express';
import * as cors from 'cors';
import * as log from '@ajar/marker';
import { urlNotFound } from '../middlewares/error.handler.js';
import attachRequestId from '../middlewares/attach_request_id.js';
import accountRouter from '../routes/account.js';
import * as fs from 'fs';
import setDoneErrorMethods from '../middlewares/set_done_error.js';

class App {
  private readonly app;

  constructor() {
    this.app = express();
    this.configEnvVariables();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorMiddlewares();
  }

  private configEnvVariables() {
    process.env = JSON.parse(fs.readFileSync('./app-config.json', 'utf8'));
  }

  private initializeMiddlewares() {
    this.app.use(attachRequestId);
    this.app.use(setDoneErrorMethods);
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes() {
    this.app.use(`${process.env.API_PATH}/account`, accountRouter.router);
  }

  private initializeErrorMiddlewares() {
    this.app.use(urlNotFound);
  }

  async start() {
    this.app.listen(Number(process.env.PORT), process.env.HOST as string, () => {
      log.magenta('api is live on', ` ✨⚡  http://${process.env.HOST}:${process.env.PORT} ✨⚡`);
    });
  }
}

const app = new App();
export default app;
