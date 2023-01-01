import { HttpStatusCodes } from './types/http_status_codes';

// @ts-ignore
export declare global {
  namespace Express {
    interface Request {
      correlation_id: string;
    }
    interface Response {
      error(error: Error, http_status?: HttpStatusCodes): void;
      done(data: any, http_status?: HttpStatusCodes): void;
    }
  }
  namespace logger{
    function info(correlation_id: string, message: string, ...params): void
    function obj(correlation_id: object, message: string, ...params): void
    function verbose(correlation_id: string, message: string, ...params): void
    function err(correlation_id: string, message: string, ...params): void
  }
}