import HttpError from './http.exception.js';
export default class InvalidArgumentsError extends HttpError {
  constructor(errorMessage: string) {
    super(`Invalid arguments : ${errorMessage}`, 404);
  }
}