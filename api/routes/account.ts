import { Router } from 'express';
import {accountController} from '../controllers/account';
import validateAccountTypes from '../middlewares/account';

class AccountRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', validateAccountTypes, accountController.createAccount);
    this.router.get('/:account_id', validateAccountTypes, accountController.getAccount);
    this.router.get('/', validateAccountTypes, accountController.getAccounts);
    this.router.put('/:account_id', validateAccountTypes, accountController.updateAccount);
    this.router.delete('/:account_id', validateAccountTypes, accountController.deleteAccount);
  }

  public getRouter() {
    return this.router;
  }
}

const accountRouter = new AccountRouter();

export default accountRouter.getRouter();
