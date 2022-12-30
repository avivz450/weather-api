import express from 'express';
import accountController from '../controllers/account.controller.js';
import validateAccountTypes from "../middlewares/account.js";

class Account {
  private readonly accountRouter = express.Router();

  constructor() {
    this.accountRouter.post('/', validateAccountTypes, accountController.createAccount);
    this.accountRouter.get('/:account_id', validateAccountTypes, accountController.getAccount);
    this.accountRouter.put('/:account_id', validateAccountTypes, accountController.updateAccount);
    this.accountRouter.delete('/:account_id', validateAccountTypes, accountController.deleteAccount);
  }

  get router() {
    return this.accountRouter;
  }
}

const accountRouter = new Account();

export default accountRouter;
