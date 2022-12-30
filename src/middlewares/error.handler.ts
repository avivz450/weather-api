import {RequestHandler } from 'express';

export const urlNotFound: RequestHandler = (req, res, next) => {
  next(new Error("URL_NOT_FOUND"));
};
