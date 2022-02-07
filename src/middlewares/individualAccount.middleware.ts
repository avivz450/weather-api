import { RequestHandler } from "express";
import  accountValidator  from "../modules/account.validation.js";

const verifyCreation: RequestHandler = async (req, res, next) => {
    await accountValidator.validateIndividualAccountCreation(req.body);
    next();
};

export default verifyCreation;
