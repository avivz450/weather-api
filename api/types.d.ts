import { HttpStatusCodes } from './types/http_status_codes';

// @ts-ignore
export declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
    interface Response {
      error(error: Error, http_status?: HttpStatusCodes): void;
      done(data: any, http_status?: HttpStatusCodes): void;
    }
  }
  namespace logger {
    function info(correlationId: string, message: string, ...params): void;
    function obj(correlationId: object, message: string, ...params): void;
    function verbose(correlationId: string, message: string, ...params): void;
    function err(correlationId: string, message: string, ...params): void;
  }
}
