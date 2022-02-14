import HttpError from './http.exception.js';

export class APIError extends HttpError {
  constructor(errorMessage: string) {
    super(`API access error: ${errorMessage}`, 500);
  }
}
