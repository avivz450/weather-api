import { RequestHandler } from 'express';

export default (asyncCb: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await asyncCb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
