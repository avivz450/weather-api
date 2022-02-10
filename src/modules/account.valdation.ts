import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationDetails from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidationUtils from '../utils/account.validator.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception';
import validationCheck from '../utils/validation.utils';
import { IIndividualAccount, IAccount, AccountTypes } from '../types/account.types.js';

class AccountValidator {
  get(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      accountValidationUtils.isValidId(payload.id),
      new InvalidArgumentsError(`primary_id must be inserted with numeric characters.`),
    ]);

    validationCheck(validation_queue);
  }

  async statusChange(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];
    const accounts: IAccount[] = await individualAccountService.getAccountsByAccountIds(
      payload.accounts_ids,
    );

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, ['accounts_ids','action']),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([
      validator.isEmptyArray(payload.accounts_ids),
      new InvalidArgumentsError('accounts_ids list should not be empty'),
    ]);

    validation_queue.push([
      accountValidationUtils.isAllIdsValid(payload.accounts_ids),
      new InvalidArgumentsError('there is an individual account_id that is not numeric'),
    ]);

    validation_queue.push([
      accountValidationUtils.isExist(accounts, accounts.length),
      new InvalidArgumentsError(`Some of the accounts are not exist`),
    ]);

    validation_queue.push([
      !accountValidationUtils.isSomeIsType(accounts, AccountTypes.Family),
      new InvalidArgumentsError(`Some of the accounts are family accounts`),
    ]);

    validation_queue.push([
      accountValidationUtils.isActionOppositeForAll(accounts, payload.action),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validationCheck(validation_queue);
  }
}

const accountValidator = new AccountValidator();
export default accountValidator;
