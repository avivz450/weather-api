import { RequestHandler } from 'express';
import familyAccountValidator from '../modules/familyAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

// export const verifyFamilyAccountCreation: RequestHandler = (req, res, next) => {
//   familyAccountValidator.creation(req.body as IGeneralObj);
//   next();
// };

// export const verifyGetFamilyAccount: RequestHandler = (req, res, next) => {
//   familyAccountValidator.get(req.params);
//   next();
// };
