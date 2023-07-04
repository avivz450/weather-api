import { RequestHandler } from 'express';
import { ErrorMessage, SuccessMessage } from '../types/types';
import { HttpStatusCodes } from '../types/enums';

function error(error: Error, httpStatus?: HttpStatusCodes): void {
  // @ts-ignore
  // eslint-disable-next-line no-invalid-this
  const res = this.req.res;
  const { message = 'GENERAL_ERROR' } = error;
  const responseStatus = httpStatus || HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const response: ErrorMessage = {
    status: 'ERROR',
    message,
  };

  res.status(responseStatus).json(response);
}

function done(data: any = null, httpStatus?: HttpStatusCodes): void {
  // @ts-ignore
  // eslint-disable-next-line no-invalid-this
  const res = this.req.res;
  const responseStatus = httpStatus || HttpStatusCodes.OK;

  const response: SuccessMessage = {
    status: 'SUCCESS',
    data,
  };

  res.status(responseStatus).json(response);
}

const setDoneErrorMethods: RequestHandler = (req, res, next) => {
  res.error = error;
  res.done = done;
  next();
};

export default setDoneErrorMethods;
