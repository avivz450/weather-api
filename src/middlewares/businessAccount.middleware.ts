import { RequestHandler } from 'express';
import businessAccountValidator from '../modules/businessAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

export const verifyBusinessAccountCreation: RequestHandler = (req, res, next) => {
  businessAccountValidator.creation(req.body as IGeneralObj);
  next();
};

export const verifyTransferToBusiness: RequestHandler = async (req, res, next) => {
  const payload = { ...req.body, ...req.params } as IGeneralObj;
  await businessAccountValidator.transferToBusiness(payload);
  next();
};

export const verifyTransferToIndividual: RequestHandler = async (req, res, next) => {
  const payload = { ...req.body, ...req.params } as IGeneralObj;
  await businessAccountValidator.transferToIndividual(payload);
  next();
};
