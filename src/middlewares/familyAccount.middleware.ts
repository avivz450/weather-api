import { RequestHandler } from 'express';
import familyAccountValidator from '../modules/familyAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

export const verifyFamilyAccountCreation: RequestHandler = async (req, res, next) => {
  await familyAccountValidator.creation(req.body as IGeneralObj);
  next();
};

export const verifyTransferToBusiness: RequestHandler = async (req, res, next) => {
  const payload = { ...req.body, ...req.params } as IGeneralObj;
  await familyAccountValidator.transferToBusiness(payload);
  next();
};
