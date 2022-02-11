import express from 'express';
import raw from '../middlewares/route.async.wrapper.js';
import accountController from '../controllers/account.controller.js';
class AccountRouter {
  private readonly accountRouter = express.Router();

  //  constructor() {
  //   this.accountRouter.patch(
  //     "/status/:action",
  //     raw(accountController.activeOrDiactiveAccounts)
  //   );
  //  }

  get router() {
    return this.accountRouter;
  }
}

const accountRouter = new AccountRouter();

export default accountRouter;
