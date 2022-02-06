import { RequestHandler } from "express";
import pkg from "uuid";

const attachRequestId: RequestHandler = (req, res, next) => {
    const { v4: uuid } = pkg;
    req.requestId = uuid();
    next();
};

export default attachRequestId;
