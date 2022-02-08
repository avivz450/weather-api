import InvalidArgumentsError from "../exceptions/InvalidArguments.exception.js";
import { IGeneralObj } from "../types/general.types.js";

export default class AccountValidator {
    static validateAccountMandatoryFields = (payload: IGeneralObj): void => {
        if (payload.currency === undefined) {
            throw new InvalidArgumentsError("currency is undefined");
        }
    };

    static checkIfPrimaryIdProvided(payload: IGeneralObj): void {
        if (payload.primary_id !== undefined) {
            throw new InvalidArgumentsError("primaryId should not be provided");
        }
    }

    static checkIdIsValid(id: string, id_length: number): void {
        if (!(id.length === id_length && /^\d+$/.test(id))) {
            throw new InvalidArgumentsError(
                `id must be made of ${id_length} numbers`
            );
        }
    }
}
