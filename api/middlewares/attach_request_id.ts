import { RequestHandler } from 'express';
import * as pkg from 'uuid';

const attachRequestId: RequestHandler = (req, res, next) => {
  const { v4: uuid } = pkg;
  req.correlationId = uuid();
  next();
};

export default attachRequestId;
