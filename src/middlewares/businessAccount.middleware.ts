import { RequestHandler } from 'express';
import businessAccountValidator from '../modules/businessAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

export const verifyBusinessAccountCreation: RequestHandler = (req, res, next) => {
  businessAccountValidator.creation(req.body as IGeneralObj);
  next();
};