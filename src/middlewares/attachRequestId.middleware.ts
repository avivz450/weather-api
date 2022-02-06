import { RequestHandler } from "express";
import pkg from "uuid";

export const attachRequestId: RequestHandler = (req, res, next) => {
    const { v4: uuid } = pkg;
    req.requestId = uuid();
    next();
};
