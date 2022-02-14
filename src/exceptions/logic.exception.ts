import HttpError from './http.exception.js';

export default class LogicError extends HttpError {
  constructor(errorMessage: string) {
    super(`Logic Error : ${errorMessage}`, 404);
  }
}
