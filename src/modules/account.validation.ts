import InvalidArgumentsError from "../exceptions/InvalidArguments.exception.js";

export default class AccountValidator {
    static validateAccountMandatoryFields = (payload: any) => {
        if (payload.currency === undefined) {
            throw new InvalidArgumentsError("currency is undefined");
        }
    };

    static checkIfPrimaryIdProvided(payload: any) {
        if (payload.primary_id !== undefined) {
            throw new InvalidArgumentsError("primaryId should not be provided");
        }
    }

    static checkIdIsValid(id: string, idLength: number) {
        if (!(id.length === idLength && /^\d+$/.test(id))) {
            throw new InvalidArgumentsError(
                `id must be made of ${idLength} numbers`
            );
        }
    }
}
