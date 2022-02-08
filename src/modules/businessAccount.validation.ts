import InvalidArgumentsError from "../exceptions/InvalidArguments.exception.js";
import { IGeneralObj } from "../types/general.types.js";
import AccountValidator from "./account.validation.js";

class BusinessAccountValidator {
    private readonly company_id_length = 8;

    static checkBusinessMandatoryFieldsExist(payload: IGeneralObj) {
        AccountValidator.validateAccountMandatoryFields(payload);

        if (payload.company_id === undefined) {
            throw new InvalidArgumentsError("companyId is undefined");
        }
        if (!/^[a-zA-Z]+$/.test(payload.company_name)) {
            throw new InvalidArgumentsError(
                "companyName supposed to consist only letters"
            );
        }
    }

    validateBusinessAccountCreation(payload: IGeneralObj) {
        BusinessAccountValidator.checkBusinessMandatoryFieldsExist(payload);
        AccountValidator.checkIfPrimaryIdProvided(payload);
        AccountValidator.checkIdIsValid(
            payload.individual_id,
            this.company_id_length
        );
    }
}

const businessAccountValidator = new BusinessAccountValidator();
export default businessAccountValidator;
