import {ValidationError} from "../modules/validation-error";
import {HttpStatusCodes} from "../types/enums";

export function getErrorStatus(error: Error){
    if (error instanceof ValidationError){
        return HttpStatusCodes.BAD_REQUEST
    }

    return HttpStatusCodes.INTERNAL_SERVER_ERROR
}