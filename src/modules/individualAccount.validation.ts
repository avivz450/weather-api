import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationTuple from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';

export class IndividualAccountValidator {
  static readonly individual_id_length = 7;

  async creation(payload: IGeneralObj) {
    const individualRequiredFields = ['individual_id', 'first_name', 'last_name', 'currency'];
    const validationQueue: ValidationTuple[] = [];

    validationQueue.push([
      validator.checkRequiredFieldsExist(payload, individualRequiredFields),
      'Some of the required values are not inserted',
    ]);

    validationQueue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      'account_id should not be inserted',
    ]);

    validationQueue.push([
      accountValidator.isValidId(
        payload.account_id,
        IndividualAccountValidator.individual_id_length,
      ),
      `id must be made of ${IndividualAccountValidator.individual_id_length} numbers`,
    ]);

    const individualAccount = await individualAccountService.getIndividualAccountsByIndividualId([
      payload.individual_id,
    ]);

    validationQueue.push([
      accountValidator.isExist(individualAccount, 0),
      `There is already a user with the input id in the system`,
    ]);
  }
}

export const individualAccountValidator = new IndividualAccountValidator();
