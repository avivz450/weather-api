import express from "express";
// import morgan from "morgan";
import cors from "cors";

// import { errorResponseMiddleware, logErrorMiddleware, printErrorMiddleware, notFoundMiddleware } from "../../middlewares/errors.handler.js";
// import { logHttpMiddleware } from "../../middlewares/http.logger.js";

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.configGeneral();
        this.configMiddlewares();
        this.configRoutes();
        this.configErrorHandlers();
    }

    private configGeneral() {
        this.app.use(cors());
        //   this.app.use(morgan("dev"));
        this.app.use(express.json());
    }

    private configRoutes() {}

    private configMiddlewares() {
        const { HTTP_LOG_PATH = "./logs/users.http.log" } = process.env;

        //   this.app.use(logHttpMiddleware(HTTP_LOG_PATH));
    }

    private configErrorHandlers() {
        const { ERRORS_LOG_PATH = "./logs/users.errors.log" } = process.env;

        //  this.app.use(logErrorMiddleware(ERRORS_LOG_PATH));
        //  this.app.use(printErrorMiddleware);
        //  this.app.use(errorResponseMiddleware);
        //  this.app.use(notFoundMiddleware);
        //  hhghg
    }
}
export default new App().app;
