import idempotencyRepository from '../repositories/idempotency.repository.js';
import { IIdempotencyRequest } from '../types/idempotency.types.js';

class IdempotencyService {
  async getReponseByIdempotencyKey(idempotency_key: IIdempotencyRequest) {
    const original_response = await idempotencyRepository.getResponseByIdempotencyKey(idempotency_key);
    return original_response ? original_response : null;
  }

    async saveResponsetData(idempotency_key: IIdempotencyRequest) {
        const inserted_response = await idempotencyRepository.saveResponseData(idempotency_key);
        return inserted_response ? true : null;
    }   
}

const idempotencyService = new IdempotencyService();
export default idempotencyService;
