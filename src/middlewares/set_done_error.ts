import { RequestHandler } from 'express';
import {BaseMessage, ResponseMessage} from "../types/messages.types";
import {HttpStatusCodes} from "../types/http_status_codes";

function error(error: Error, http_status?: HttpStatusCodes):void{
  // @ts-ignore
  // eslint-disable-next-line no-invalid-this
  const res = this.req.res;
  const { message = "GENERAL_ERROR"} = error;
  const response_status = http_status || HttpStatusCodes.INTERNAL_SERVER_ERROR;

  const response: BaseMessage = {
    message
  };

  res.status(response_status).json(response);
}

function done(data: any = null):void{
    // @ts-ignore
    // eslint-disable-next-line no-invalid-this
    const res = this.req.res;

    const response: ResponseMessage = {
      message: 'SUCCESS',
      data,
    };

    res.status(HttpStatusCodes.OK).json(response);
}

const setDoneErrorMethods: RequestHandler = (req, res, next) => {
  res.error = error;
  res.done = done;
  next();
};

export default setDoneErrorMethods;
