import InvalidArgumentsError from "../exceptions/InvalidArguments.exception.js";
import AccountValidator from "./account.validation.js";

class IndividualAccountValidator {
    private readonly individual_id_length = 7;

    static checkIndividualMandatoryFieldsExist = (payload: any) => {
        AccountValidator.validateAccountMandatoryFields(payload);

        if (payload.individual_id === undefined) {
            throw new InvalidArgumentsError("individualId is undefined");
        }
        if (!/^[a-zA-Z]+$/.test(payload.first_name)) {
            throw new InvalidArgumentsError(
                "firstName supposed to consist only letters"
            );
        }
        if (!/^[a-zA-Z]+$/.test(payload.last_name)) {
            throw new InvalidArgumentsError(
                "lastName supposed to consist only letters"
            );
        }
    };

    static async checkIndividualIdInDb(individual_id: string) {
        const individualAccount =
            await individualAccountService.getIndividualAccountByIndividualId(
                individual_id
            );

        if (!individualAccount) {
            throw new InvalidArgumentsError(
                "individualId must be at most in one account"
            );
        }
    }

    async validateIndividualAccountCreation(payload: any) {
        IndividualAccountValidator.checkIndividualMandatoryFieldsExist(payload);
        AccountValidator.checkIfPrimaryIdProvided(payload);
        AccountValidator.checkIdIsValid(
            payload.individual_id,
            this.individual_id_length
        );
        await IndividualAccountValidator.checkIndividualIdInDb(
            payload.individual_id
        );
    }
}

const individualAccountValidator = new IndividualAccountValidator();
export default individualAccountValidator;
