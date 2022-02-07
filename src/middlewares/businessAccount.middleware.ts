import { RequestHandler } from "express";
import accountValidator from "../modules/account.validation.js";

const verifyBusinessAccountCreation: RequestHandler = async (
    req,
    res,
    next
) => {
    await accountValidator.validateBusinessAccountCreation(req.body);
    next();
};

export default verifyBusinessAccountCreation;
