import { Request, Response, NextFunction, RequestHandler } from "express";
import idempotencyService from "../services/idempotency.service.js";
import { IIdempotencyRequest } from "../types/idempotency.types.js";
import { IdempotencyException } from '../exceptions/idempotency.exception.js';

export const enforceIdempotency: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    const idempotency_key = req.headers['x-idempotency-key'] as string; 
    const agent_id = req.agent_id;
    const idempotency_request: IIdempotencyRequest = { idempotency_key, agent_id: Number(agent_id) }; 

    if (idempotency_key) {
      const original_response = await idempotencyService.getReponseByIdempotencyKey(idempotency_request);
      return original_response ? res.send(original_response.data) : next();
    }
    next();
}
