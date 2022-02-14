import HttpError from './http.exception.js';

export default class TransferError extends HttpError {
  constructor(errorMessage: string) {
    super(`Transfer Error : ${errorMessage}`, 404);
  }
}
