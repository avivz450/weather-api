import HttpError from "./http.exception.js";

export default class transferError extends HttpError {
    constructor(errorMessage: string) {
        super(`Transfer Error:${errorMessage}`,404);
    }
}
