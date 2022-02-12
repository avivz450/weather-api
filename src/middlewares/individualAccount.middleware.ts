import { RequestHandler } from 'express';
import individualAccountValidator from '../modules/individualAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

class IndividualMiddlewares {
  verifyCreation: RequestHandler = async (req, res, next) => {
    await individualAccountValidator.creation(req.body as IGeneralObj);
    next();
  };
}

const individualMiddlewares = new IndividualMiddlewares();
export default individualMiddlewares;