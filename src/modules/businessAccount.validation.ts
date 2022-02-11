import { IGeneralObj } from '../types/general.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';
import validationCheck from '../utils/validation.utils.js';
import ValidationDetails from '../types/validation.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import { IndividualAccountValidator } from './individualAccount.validation.js';
class BusinessAccountValidator {
  private readonly company_id_length = 8;
  readonly min_amount_of_balance = 10000;

  creation(payload: IGeneralObj) {
    const businessRequiredFields = ['company_id', 'company_name', 'currency'];
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, businessRequiredFields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validation_queue.push([
      accountValidationUtils.isValidId(payload.account_id, this.company_id_length),
      new InvalidArgumentsError(
        `id must be made of ${IndividualAccountValidator.individual_id_length} numbers`,
      ),
    ]);

    validationCheck(validation_queue);
  }

  get minAmountOfBalance() {
    return this.min_amount_of_balance;
  }
}

const businessAccountValidator = new BusinessAccountValidator();
export default businessAccountValidator;
