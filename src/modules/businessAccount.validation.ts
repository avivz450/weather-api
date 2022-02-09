import { IGeneralObj } from '../types/general.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';

class BusinessAccountValidator {
  private readonly company_id_length = 8;

  creation(payload: IGeneralObj) {
    const businessRequiredFields = ['company_id', 'company_name', 'currency'];

    validator.checkRequiredFieldsExist(payload, businessRequiredFields);
    validator.checkFieldsNotExist(payload, ['account_id']);
    accountValidator.isValidId(payload.account_id, this.company_id_length);
  }
}

const businessAccountValidator = new BusinessAccountValidator();
export default businessAccountValidator;
