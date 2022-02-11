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
    const individualRequiredFields = ['individual_id', 'first_name', 'last_name', 'currency'];
    const validationQueue: ValidationDetails[] = [];

    validationQueue.push([
      validator.checkRequiredFieldsExist(payload, individualRequiredFields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validationQueue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validationQueue.push([
      accountValidator.isValidId(
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

    validationQueue.push([
      accountValidator.isExist(individualAccount, 0),
      new InvalidArgumentsError(`There is already a user with the input id in the system`),
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

export const individualAccountValidator = new IndividualAccountValidator();
