import { RequestHandler } from "express";
import accountValidator from "../modules/account.validation.js";

const verifyIndividualAccountCreation: RequestHandler = async (
    req,
    res,
    next
) => {
    await accountValidator.validateIndividualAccountCreation(req.body);
    next();
};

export default verifyIndividualAccountCreation;
