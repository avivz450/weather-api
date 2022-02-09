import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';

export class IndividualAccountValidator {
  static readonly individual_id_length = 7;

  async creation(payload: IGeneralObj) {
    const individualRequiredFields = ['individual_id', 'first_name', 'last_name', 'currency'];

    validator.checkRequiredFieldsExist(payload, individualRequiredFields);
    validator.checkFieldsNotExist(payload, ['account_id']);
    accountValidator.isValidId(payload.account_id, IndividualAccountValidator.individual_id_length);
    const individualAccount = await individualAccountService.getIndividualAccountsByIndividualId([
      payload.individual_id,
    ]);
    accountValidator.isExist(individualAccount, 0);
  }
}

export const individualAccountValidator = new IndividualAccountValidator();
