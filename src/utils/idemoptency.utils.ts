import idempotencyService from "../services/idempotency.service.js";
import {IIdempotencyRequest} from '../types/idempotency.types.js';
import {Request} from 'express';
import { ResponseMessage } from "../types/messages.types.js";

export default async function saveResponseData(req: Request, data: ResponseMessage) {
    const idempotency_key = req.headers['x-idempotency-key'] as string;
    const body = JSON.stringify(data);
    const idempotency_request: IIdempotencyRequest = { idempotency_key, agent_id: Number(req.agent_id), body: body };
    
    if (idempotency_key && req.agent_id) {
      await idempotencyService.saveResponsetData(idempotency_request);
    }
}