import { RequestHandler } from 'express';
import fs from 'fs';

export default function logger(filePath: string): RequestHandler {
  const writeStream = fs.createWriteStream(filePath, {
    encoding: 'utf-8',
    flags: 'a',
  });

  return function loggerMiddleware(req, res, next) {
    const { method, originalUrl, requestId } = req;
    writeStream.write(`${requestId} ${method} :: ${originalUrl} >> ${Date.now()}\n`);

    next();
  };
}
