import * as express from 'express';
import accountController from '../controllers/account.controller.js';
import validateAccountTypes from '../middlewares/account.js';

class Account {
  private readonly _router = express.Router();

  constructor() {
    this.router.post('/', validateAccountTypes, accountController.createAccount);
    this.router.get('/:account_id', validateAccountTypes, accountController.getAccount);
    this.router.get('/', validateAccountTypes, accountController.getAccounts);
    this.router.put('/:account_id', validateAccountTypes, accountController.updateAccount);
    this.router.delete('/:account_id', validateAccountTypes, accountController.deleteAccount);
  }

  get router() {
    return this._router;
  }
}

const accountRouter = new Account();

export default accountRouter;
