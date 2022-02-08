import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import AccountValidator from './account.validation.js';

class FamilyAccountValidator {
  static checkFamilyMandatoryFieldsExist(payload: any) {
    AccountValidator.validateAccountMandatoryFields(payload);

    if (Array.isArray(payload.individualAccountsDetails) === false) {
      throw new InvalidArgumentsError('individualAccountsDetails is not an array');
    } else {
      payload.individualAccountsDetails.forEach(accountDetails => {
        if (typeof accountDetails[0] !== 'string') {
          throw new InvalidArgumentsError('individualAccountsDetails is not an array');
        }
        if (Number.isNaN(accountDetails[1])) {
          throw new InvalidArgumentsError('individualAccountsDetails is not an array');
        }
      });
    }
  }

  async validateFamilyAccountCreation(payload: any) {
    FamilyAccountValidator.checkFamilyMandatoryFieldsExist(payload);
    AccountValidator.checkIfPrimaryIdProvided(payload);
  }
}

const familyAccountValidator = new FamilyAccountValidator();
export default familyAccountValidator;
