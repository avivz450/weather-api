import InvalidArgumentsError from "../exceptions/InvalidArguments.exception.js";

class AccountValidator {
    private readonly individual_id_length = 7;
    
    private readonly company_id_length = 8;

    static validateAccountMandatoryFields = (payload: any) => {
        if (payload.currency === undefined) {
            throw new InvalidArgumentsError("currency is undefined");
        }
    };

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

    static checkBusinessMandatoryFieldsExist(payload: any) {
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
        AccountValidator.checkIndividualMandatoryFieldsExist(payload);
        AccountValidator.checkIfPrimaryIdProvided(payload);
        AccountValidator.checkIdIsValid(
            payload.individual_id,
            this.individual_id_length
        );
        await AccountValidator.checkIndividualIdInDb(payload.individual_id);
    }

    async validateBusinessAccountCreation(payload: any) {
        AccountValidator.checkBusinessMandatoryFieldsExist(payload);
        AccountValidator.checkIfPrimaryIdProvided(payload);
        AccountValidator.checkIdIsValid(
            payload.individual_id,
            this.company_id_length
        );
    }
}

const accountValidator = new AccountValidator();
export default accountValidator;
