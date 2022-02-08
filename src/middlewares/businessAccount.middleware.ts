import { RequestHandler } from "express";
import businessAccountValidator from "../modules/businessAccount.validation.js";

const verifyBusinessAccountCreation: RequestHandler = async (
    req,
    res,
    next
) => {
    await businessAccountValidator.validateBusinessAccountCreation(req.body);
    next();
};

export default verifyBusinessAccountCreation;
