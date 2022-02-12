import HttpError from './http.exception.js';

 export class AuthenticationException extends HttpError {
  constructor(errorMessage: string) {
    super(`Authentication Error: ${errorMessage}`, 500);
  }
}
