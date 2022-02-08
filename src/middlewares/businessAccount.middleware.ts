<<<<<<< HEAD
import { RequestHandler } from 'express';
import businessAccountValidator from '../modules/businessAccount.validation.js';
import { IGeneralObj } from '../types/general.types.js';

const verifyBusinessAccountCreation: RequestHandler = (req, res, next) => {
  businessAccountValidator.validateBusinessAccountCreation(req.body as IGeneralObj);
  next();
=======
import { RequestHandler } from "express";
import businessAccountValidator from "../modules/businessAccount.validation.js";
import { IGeneralObj } from "../types/general.types.js";

const verifyBusinessAccountCreation: RequestHandler = (req, res, next) => {
    businessAccountValidator.validateBusinessAccountCreation(
        req.body as IGeneralObj
    );
    next();
>>>>>>> ffcc83c1b5c7bb11de1ad4b97bb58fbea9f6198a
};

export default verifyBusinessAccountCreation;
