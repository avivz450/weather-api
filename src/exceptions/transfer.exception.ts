import HttpError from "./http.exception.js";

export default class transferError extends HttpError {
    constructor(errorMessage: string) {
        super(`transfer faild:${errorMessage}`,404);
    }
}
