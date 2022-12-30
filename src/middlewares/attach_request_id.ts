import { RequestHandler } from 'express';
import * as pkg from 'uuid';

const attachRequestId: RequestHandler = (req, res, next) => {
  const { v4: uuid } = pkg;
  req.correlation_id = uuid();
  next();
};

export default attachRequestId;
