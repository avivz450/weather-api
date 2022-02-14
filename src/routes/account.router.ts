import express from 'express';
import raw from '../middlewares/route.async.wrapper.js';
import accountController from '../controllers/account.controller.js';
import accountMiddlewares from '../middlewares/account.middleware.js';

class AccountRouter {
  private readonly accountRouter = express.Router();

  constructor() {
    this.accountRouter.patch('/status/:action', raw(accountMiddlewares.verifyStatusChange), raw(accountController.changeStatus));
  }

  get router() {
    return this.accountRouter;
  }
}

const accountRouter = new AccountRouter();

export default accountRouter;
