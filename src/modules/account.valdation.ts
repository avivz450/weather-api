import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationDetails from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidationUtils from '../utils/account.validator.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import validationCheck from '../utils/validation.utils.js';
import { IAccount, AccountTypes, AccountStatuses, TransferTypes } from '../types/account.types.js';
import accountRepository from '../repositories/Account.repository.js';
import accountService from '../services/account.service.js';
import { Console } from 'console';

class AccountValidator {
  get(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      accountValidationUtils.isValidId(String(payload.account_id)),
      new InvalidArgumentsError(`primary_id must be inserted with numeric characters.`),
    ]);

    validationCheck(validation_queue);
  }

  // async statusChange(payload: IGeneralObj) {
  //   const validation_queue: ValidationDetails[] = [];
  //   const accounts: IAccount[] = await accountRepository.getAccountsByAccountIds(
  //     payload.accounts_ids,
  //   );

  //   validation_queue.push([
  //     validator.checkRequiredFieldsExist(payload, ['accounts_ids', 'action']),
  //     new InvalidArgumentsError('Some of the required values are not inserted'),
  //   ]);

  //   validation_queue.push([
  //     validator.isEmptyArray(payload.accounts_ids as any[]),
  //     new InvalidArgumentsError('accounts_ids list should not be empty'),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isValidIds(payload.accounts_ids as string[]),
  //     new InvalidArgumentsError('there is an individual account_id that is not numeric'),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isExist(accounts, payload.accounts_ids),
  //     new InvalidArgumentsError(`Some of the accounts are not exist`),
  //   ]);

  //   validation_queue.push([
  //     !accountValidationUtils.isSomeIsType(accounts, AccountTypes.Family),
  //     new InvalidArgumentsError(`Some of the accounts are family accounts`),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isActionOppositeForAll(accounts, payload.action as AccountStatuses),
  //     new InvalidArgumentsError(`Some of the accounts has ${payload.action} status`),
  //   ]);

  //   validationCheck(validation_queue);
  // }

  async transfer(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];
    const accounts_ids: string[] = [payload.source_account_id, payload.destination_account_id];

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, [
        'source_account_id',
        'destination_account_id',
        'amount',
        'transfer',
      ]),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([
      accountValidationUtils.isValidIds(accounts_ids),
      new InvalidArgumentsError('One of the ids is not valid'),
    ]);

    validationCheck(validation_queue);

    const accounts: IAccount[] = await accountRepository.getAccountsByAccountIds(accounts_ids);
    const is_same_currency_transfer = TransferTypes.same_currency === payload.transfer;
    const is_both_accounts_with_same_currency = accountValidationUtils.isAllWithSameCurrency(
      accounts[0].currency,
      accounts,
    );

    validation_queue.push([
      accountValidationUtils.isExist(accounts.map(account => account.account_id), accounts_ids.length),
      new InvalidArgumentsError(`Some of the accounts are not exist`),
    ]);

    validation_queue.push([
      accountValidationUtils.isAllAccountsWithSameStatus(accounts, AccountStatuses.active),
      new InvalidArgumentsError(`Some of the accounts are not active`),
    ]);


    validation_queue.push([
      accountValidationUtils.isTransferOptionValid(payload.transfer),
      new InvalidArgumentsError(`Chosen transfer type is invalid`),
    ]);

    validation_queue.push([
      (is_same_currency_transfer && is_both_accounts_with_same_currency) ||
        (!is_same_currency_transfer && !is_both_accounts_with_same_currency),
      new InvalidArgumentsError(`Chosen transfer type is not possible by the accounts currency`),
    ]);

    validation_queue.push([
      validator.isNumberPositive(Number(payload.amount)),
      new InvalidArgumentsError(`Transfer amount is not a positive number`),
    ]);

    validationCheck(validation_queue);
  }
}

const accountValidator = new AccountValidator();
export default accountValidator;
