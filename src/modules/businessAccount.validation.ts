import { IGeneralObj } from '../types/general.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';
import validationCheck from '../utils/validation.utils';
import ValidationDetails from '../types/validation.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import { IndividualAccountValidator } from './individualAccount.validation.js';
class BusinessAccountValidator {
  private readonly company_id_length = 8;

  creation(payload: IGeneralObj) {
    const businessRequiredFields = ['company_id', 'company_name', 'currency'];
    const validationQueue: ValidationDetails[] = [];

    validationQueue.push([
      validator.checkRequiredFieldsExist(payload, businessRequiredFields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validationQueue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validationQueue.push([
      accountValidator.isValidId(payload.account_id, this.company_id_length),
      new InvalidArgumentsError(
        `id must be made of ${IndividualAccountValidator.individual_id_length} numbers`,
      ),
    ]);

    validationCheck(validationQueue);
  }

  get(payload: IGeneralObj) {
    const validationQueue: ValidationDetails[] = [];

    validationQueue.push([
      accountValidator.isValidId(payload.id),
      new InvalidArgumentsError(
        `primary_id must be inserted with numeric characters.`,
      ),
    ]);

    validationCheck(validationQueue);
  }
}

const businessAccountValidator = new BusinessAccountValidator();
export default businessAccountValidator;
