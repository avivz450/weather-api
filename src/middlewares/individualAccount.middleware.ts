import { RequestHandler } from "express";
import individualAccountValidator from "../modules/individualAccount.validation.js";

const verifyIndividualAccountCreation: RequestHandler = async (
    req,
    res,
    next
) => {
    await individualAccountValidator.validateIndividualAccountCreation(req.body);
    next();
};

export default verifyIndividualAccountCreation;
