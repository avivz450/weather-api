import { RequestHandler } from 'express';
import familyAccountValidator from '../modules/familyAccount.validation.js';
import individualAccountValidator from '../modules/individualAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

class IndividualMiddlewares {
  transferConnectedFamily: RequestHandler = async (req, res, next) => {
    const payload = { ...req.body, ...req.params } as IGeneralObj;
    await familyAccountValidator.transferToIndividual(payload);
    next();
  };

  verifyCreation: RequestHandler = async (req, res, next) => {
    await individualAccountValidator.creation(req.body as IGeneralObj);
    next();
  };
}

const individualMiddlewares = new IndividualMiddlewares();
export default individualMiddlewares;
