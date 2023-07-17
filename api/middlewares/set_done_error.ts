import { RequestHandler } from 'express';
import { ErrorMessage, SuccessMessage } from '../types/types';
import { HttpStatusCodes } from '../types/enums';
import {getErrorStatus} from "../utilities/error";

function error(error: Error, httpStatus?: HttpStatusCodes): void {
  // @ts-ignore
  // eslint-disable-next-line no-invalid-this
  const res = this.req.res;
  const { message = 'GENERAL_ERROR' } = error;
  const code = httpStatus || getErrorStatus(error);

  const response: ErrorMessage = {
    status: 'error',
    error: {
      code,
      message
    },
  };

  res.status(code).json(response);
}

function done(data: any = null, httpStatus?: HttpStatusCodes): void {
  // @ts-ignore
  // eslint-disable-next-line no-invalid-this
  const res = this.req.res;
  const responseStatus = httpStatus || HttpStatusCodes.OK;

  const response: SuccessMessage = {
    status: 'success',
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
