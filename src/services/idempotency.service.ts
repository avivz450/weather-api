import idempotencyRepository from '../repositories/idempotency.repository.js';
import { IIdempotencyRequest } from '../types/idempotency.types.js';

class IdempotencyService {
    async getReponseByIdempotencyKey(idempotency_key: IIdempotencyRequest) {
        const original_response = await idempotencyRepository.getResponseByIdempotencyKey(idempotency_key);
        return original_response ? original_response : null;
    }   

    async insertRequestData(idempotency_key: IIdempotencyRequest) {
        const inserted_request = await idempotencyRepository.insertResponseData(idempotency_key);
        return inserted_request ? true : null;
    }   
}

const idempotencyService = new IdempotencyService();
export default idempotencyService;
