import { RequestHandler } from 'express';
import businessAccountValidator from '../modules/businessAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

export const verifyBusinessAccountCreation: RequestHandler = (req, res, next) => {
  businessAccountValidator.creation(req.body as IGeneralObj);
  next();
};

export const verifyTransferToBusiness: RequestHandler = (req, res, next) => {
  const payload = { ...req.body, ...req.params } as IGeneralObj;
  businessAccountValidator.transferToBusiness(payload);
  next();
};

export const verifyTransferToIndividual: RequestHandler = (req, res, next) => {
  const payload = { ...req.body, ...req.params } as IGeneralObj;
  businessAccountValidator.transferToIndividual(payload);
  next();
};
