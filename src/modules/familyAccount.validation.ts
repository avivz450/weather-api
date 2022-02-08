import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import AccountValidator from './account.validation.js';
import { IGeneralObj } from '../types/general.types.js';
import { AccountDetails } from '../types/account.types.js';

class FamilyAccountValidator {
  static checkFamilyMandatoryFieldsExist(payload:IGeneralObj) {
    AccountValidator.validateAccountMandatoryFields(payload);

    if (Array.isArray(payload.individualAccountsDetails) === false) {
      throw new InvalidArgumentsError('individualAccountsDetails is not an array');
    } else {
      (payload.individualAccountsDetails as unknown as AccountDetails[]).forEach(accountDetails => {
        if (typeof accountDetails[0] !== 'string') {
          throw new InvalidArgumentsError('individualAccountsDetails is not an array');
        }
        if (Number.isNaN(accountDetails[1])) {
          throw new InvalidArgumentsError('individualAccountsDetails is not an array');
        }
      });
    }
  }

  validateFamilyAccountCreation(payload: IGeneralObj) {
    FamilyAccountValidator.checkFamilyMandatoryFieldsExist(payload);
    AccountValidator.checkIfPrimaryIdProvided(payload);
  }
}

const familyAccountValidator = new FamilyAccountValidator();
export default familyAccountValidator;
