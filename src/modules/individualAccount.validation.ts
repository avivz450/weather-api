import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationDetails from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import validationCheck from '../utils/validation.utils.js';
export class IndividualAccountValidator {
  static readonly individual_id_length = 7;

  async creation(payload: IGeneralObj) {
    const individual_required_fields = ['individual_id', 'first_name', 'last_name', 'currency'];
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, individual_required_fields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validation_queue.push([
      accountValidationUtils.isValidId(
        payload.account_id,
        IndividualAccountValidator.individual_id_length,
      ),
      new InvalidArgumentsError(
        `id must be made of ${IndividualAccountValidator.individual_id_length} numbers`,
      ),
    ]);

    const individualAccount = await individualAccountService.getIndividualAccountsByIndividualIds([
      payload.individual_id,
    ]);

    validation_queue.push([
      accountValidationUtils.isExist(individualAccount, 0),
      new InvalidArgumentsError(`There is already a user with the input id in the system`),
    ]);

    validationCheck(validation_queue);
  }
}

export const individualAccountValidator = new IndividualAccountValidator();
