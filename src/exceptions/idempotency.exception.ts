import HttpError from './http.exception.js';

export class IdempotencyException extends HttpError {
  constructor(errorMessage: string) {
    super(`Idempotency Error: ${errorMessage}`, 500);
  }
}
