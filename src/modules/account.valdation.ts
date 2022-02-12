import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationDetails from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidationUtils from '../utils/account.validator.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import validationCheck from '../utils/validation.utils.js';
import { IAccount, AccountTypes, AccountStatuses, TransferTypes } from '../types/account.types.js';

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
  //   const accounts: IAccount[] = await individualAccountService.getAccountsByAccountIds(
  //     payload.accounts_ids,
  //   );

  //   validation_queue.push([
  //     validator.checkRequiredFieldsExist(payload, ['accounts_ids', 'action']),
  //     new InvalidArgumentsError('Some of the required values are not inserted'),
  //   ]);

  //   validation_queue.push([
  //     validator.isEmptyArray(String(payload.accounts_ids)),
  //     new InvalidArgumentsError('accounts_ids list should not be empty'),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isValidIds(String(payload.accounts_ids)),
  //     new InvalidArgumentsError('there is an individual account_id that is not numeric'),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isExist(accounts, accounts.length),
  //     new InvalidArgumentsError(`Some of the accounts are not exist`),
  //   ]);

  //   validation_queue.push([
  //     !accountValidationUtils.isSomeIsType(accounts, AccountTypes.Family),
  //     new InvalidArgumentsError(`Some of the accounts are family accounts`),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isActionOppositeForAll(accounts, String(payload.action)),
  //     new InvalidArgumentsError('Some of the required values are not inserted'),
  //   ]);

  //   validationCheck(validation_queue);
  // }

  // async transfer(payload: IGeneralObj) {
  //   const validation_queue: ValidationDetails[] = [];
  //   const accounts_ids: string[] = [payload.source_account, payload.destination_account];

  //   validation_queue.push([
  //     validator.checkRequiredFieldsExist(payload, [
  //       'source_account_id',
  //       'source_account_type',
  //       'destination_account_id',
  //       'destination_account_type',
  //       'amount',
  //       'transfer',
  //     ]),
  //     new InvalidArgumentsError('Some of the required values are not inserted'),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isValidIds(accounts_ids),
  //     new InvalidArgumentsError('One of the ids is not valid'),
  //   ]);

  //   const accounts: IAccount[] = await individualAccountService.getAccountsByAccountIds(
  //     accounts_ids,
  //   );
  //   const is_same_currency_transfer = TransferTypes.same_currency === payload.transfer;
  //   const is_both_accounts_with_same_currency = accountValidationUtils.isAllWithSameCurrency(
  //     accounts[0].currency,
  //     accounts,
  //   );

  //   validation_queue.push([
  //     accountValidationUtils.isExist(accounts, accounts.length),
  //     new InvalidArgumentsError(`Some of the accounts are not exist`),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isAllAccountsWithSameStatus(accounts, AccountStatuses.active),
  //     new InvalidArgumentsError(`Some of the accounts are not active`),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isTransferOptionValid(String(payload.transfer)),
  //     new InvalidArgumentsError(`Chosen transfer type is invalid`),
  //   ]);

  //   validation_queue.push([
  //     (is_same_currency_transfer && is_both_accounts_with_same_currency) ||
  //       (!is_same_currency_transfer && !is_both_accounts_with_same_currency),
  //     new InvalidArgumentsError(`Chosen transfer type is not possible by the accounts currency`),
  //   ]);

  //   validation_queue.push([
  //     validator.isNumberPositive(Number(payload.amount)),
  //     new InvalidArgumentsError(`Transfer amount is not a positive number`),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isAllIsType([accounts[0]], payload.source_account_type as AccountTypes),
  //     new InvalidArgumentsError(`Source account is not a ${payload.source_account_type as AccountTypes} account`),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isAllIsType([accounts[1]], payload.destination_account_type as AccountTypes),
  //     new InvalidArgumentsError(
  //       `Destionation account is not a ${payload.destination_account_type as AccountTypes} account`,
  //     ),
  //   ]);

  //   validation_queue.push([
  //     accountValidationUtils.isBalanceAllowsTransfer(
  //       accounts[0],
  //       Number(payload.amount),
  //       payload.source_account_type as AccountTypes,
  //     ),
  //     new InvalidArgumentsError(
  //       `Balance after transaction will be below the minimal remiaining balance of ${payload.source_account_type as AccountTypes}`,
  //     ),
  //   ]);

  //   validationCheck(validation_queue);
  // }
}

const accountValidator = new AccountValidator();
export default accountValidator;
