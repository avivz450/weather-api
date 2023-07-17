import {check, validationResult} from "express-validator";
import {ValidationError} from "../modules/validation-error";
import {RequestHandler} from "express";

export const validateGetTimeline: RequestHandler = async (req, res, next) => {
    const validationRules = [
        check('location').notEmpty().withMessage('location is required'),
        check('rule').notEmpty().withMessage('rule is required')
    ];

    await Promise.all(validationRules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        res.error(new ValidationError(`VALIDATION_ERROR: ${errorMessages.join(', ')}`));
    } else {
        next();
    }
};