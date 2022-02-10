import HttpError from './http.exception.js';

export default class DatabaseException extends HttpError {
  constructor(errorMessage: string) {
    super(`Database Error: ${errorMessage}`, 500);
  }
}
