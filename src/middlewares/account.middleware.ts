import { RequestHandler } from 'express';
import accountValidator from '../modules/account.valdation.js';

class AccountMiddlewares {
  verifyGetAccount: RequestHandler = (req, res, next) => {
    accountValidator.get(req.params);
    next();
  };

  // verifyStatusChange: RequestHandler = async (req, res, next) => {
  //   const payload = { ...req.body, ...req.params };
  //   await accountValidator.statusChange(payload);
  //   next();
  // };
}

const accountMiddlewares = new AccountMiddlewares();
export default accountMiddlewares;
