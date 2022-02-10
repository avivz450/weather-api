import { RequestHandler } from 'express';
import accountValidator from '../modules/account.valdation';

export const verifyGetAccount: RequestHandler = (req, res, next) => {
  accountValidator.get(req.params);
  next();
};
