import HttpError from "./http.exception.js";

export default class logicError extends HttpError {
    constructor(errorMessage: string) {
        super(`your call faild:${errorMessage}`,404);
    }
}
