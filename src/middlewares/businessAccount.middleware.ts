import { RequestHandler } from "express";
import businessAccountValidator from "../modules/businessAccount.validation.js";
import { IGeneralObj } from "../types/general.types.js";

<<<<<<< HEAD
const verifyBusinessAccountCreation: RequestHandler = (req, res, next) => {
    businessAccountValidator.validateBusinessAccountCreation(
        req.body as IGeneralObj
    );
=======
const verifyBusinessAccountCreation: RequestHandler = (
    req,
    res,
    next
) => {
    businessAccountValidator.validateBusinessAccountCreation(req.body as IGeneralObj);
>>>>>>> 3a44019e2e5aab22180d660982187f2e71a68506
    next();
};

export default verifyBusinessAccountCreation;
