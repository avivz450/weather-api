export interface IGeneralObj {
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      agent_id: string;
      idempotency_key: string;
    }
  }
}
