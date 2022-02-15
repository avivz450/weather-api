import fs from 'fs';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import log from '@ajar/marker';
import { ErrorMessage } from '../types/messages.types.js';
import HttpError from '../exceptions/http.exception.js';
import UrlNotFoundError from '../exceptions/urlNotFound.exception.js';

const { NODE_ENV } = process.env;

type ErrorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => ReturnType<RequestHandler>;

export const urlNotFound: RequestHandler = (req, res, next) => {
  next(new UrlNotFoundError(req.originalUrl));
};

export const printError: ErrorMiddleware = (err, req, res, next) => {
  log.error(err);
  next(err);
};

export const errorLogger = (filepath: string): ErrorMiddleware => {
  const writeStream = fs.createWriteStream(filepath, {
    flags: 'a',
    encoding: 'utf-8',
  });

  return (err, req, res, next) => {
    const { requestId } = req;
    const { message, status, stack } = err;
    writeStream.write(`${requestId} - ${status} :: ${message} >> ${stack as string}\n`);

    next(err);
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorResponse: ErrorMiddleware = (err, req, res, next) => {
  const { message, status, stack } = err;

  const response: ErrorMessage = {
    message: message || 'something went wrong...',
    status: status || 500,
  };

  if (NODE_ENV !== 'production') {
    response.stack = stack;
  }

  res.status(response.status).json(response);
};
