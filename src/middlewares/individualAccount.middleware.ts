import { RequestHandler } from "express";
import individualAccountValidator from "../modules/individualAccount.validation.js";
import { IGeneralObj } from "../types/general.types.js";

const verifyIndividualAccountCreation: RequestHandler = async (
    req,
    res,
    next
) => {
    await individualAccountValidator.validateIndividualAccountCreation(
        req.body as IGeneralObj
    );
    next();
};

export default verifyIndividualAccountCreation;
