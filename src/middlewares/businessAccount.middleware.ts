import { RequestHandler } from 'express';
import businessAccountValidator from '../modules/businessAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

class BusinessMiddlewares {
  verifyCreation: RequestHandler = (req, res, next) => {
    businessAccountValidator.creation(req.body as IGeneralObj);
    next();
  };

  verifyTransferToBusiness: RequestHandler = async (req, res, next) => {
    const payload = { ...req.body, ...req.params } as IGeneralObj;
    await businessAccountValidator.transferToBusiness(payload);
    next();
  };

  verifyTransferToIndividual: RequestHandler = async (req, res, next) => {
    const payload = { ...req.body, ...req.params } as IGeneralObj;
    await businessAccountValidator.transferToIndividual(payload);
    next();
  };
}

const businessMiddlewares = new BusinessMiddlewares();
export default businessMiddlewares;
