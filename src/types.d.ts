import { HttpStatusCodes } from './types/http_status_codes';

// @ts-ignore
export declare global {
  namespace Express {
    interface Request {
      correlation_id: string;
    }
    interface Response {
      error(error: Error, http_status?: HttpStatusCodes): void;
      done(data: any): void;
    }
  }
}
