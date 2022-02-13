import { RequestHandler } from 'express';
import familyAccountValidator from '../modules/familyAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

class FamilyMiddlewares {
  verifyCreation: RequestHandler = async (req, res, next) => {
    await familyAccountValidator.creation(req.body as IGeneralObj);
    next();
  };

  verifyCloseAccount: RequestHandler = async (req, res, next) => {
    await familyAccountValidator.closeAccount(req.params as IGeneralObj);
    next();
  };

  verifyAddIndividuals: RequestHandler = async (req, res, next) => {
    const payload = { ...req.body, ...req.params } as IGeneralObj;
    await familyAccountValidator.addIndividualAccounts(payload);
    next();
  };

  // verifyRemoveIndividuals: RequestHandler = async (req, res, next) => {
  //   const payload = { ...req.body, ...req.params } as IGeneralObj;
  //   await familyAccountValidator.removeIndividualAccounts(payload);
  //   next();
  // };

  // export const verifyTransferToBusiness: RequestHandler = async (req, res, next) => {
  //   const payload = { ...req.body, ...req.params } as IGeneralObj;
  //   await familyAccountValidator.transferToBusiness(payload);
  //   next();
  // };
}

const familyMiddlewares = new FamilyMiddlewares();
export default familyMiddlewares;