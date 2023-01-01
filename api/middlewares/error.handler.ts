import { RequestHandler } from 'express';

export const urlNotFound: RequestHandler = (req, res) => {
  res.error(new Error('URL_NOT_FOUND'));
};
