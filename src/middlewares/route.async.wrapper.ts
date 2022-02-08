import { RequestHandler } from 'express';

export default (asyncCb: Function): RequestHandler =>
  async (req, res, next) => {
    try {
      await asyncCb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
