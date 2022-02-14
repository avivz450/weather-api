import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationDetails from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidationUtils from '../utils/account.validator.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import validationCheck from '../utils/validation.utils.js';
import { IAccount, AccountTypes, AccountStatuses, TransferTypes, DetailsLevel } from '../types/account.types.js';
import accountRepository from '../repositories/account.repository.js';
import businessAccountService from '../services/businessAccount.service.js';
import businessAccountRepository from '../repositories/bussinessAccount.repository.js';

class AccountValidator {
  get(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([accountValidationUtils.isValidId(String(payload.account_id)), new InvalidArgumentsError(`account id must be inserted with numeric characters only.`)]);

    validationCheck(validation_queue);
  }

  async statusChange(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];
    let accounts: IAccount[] = [];
    const accounts_details = payload.accounts_details as any[];
    const accounts_ids = accounts_details.map(account_details => account_details[0]);
    const individual_accounts_ids: string[] = accounts_details.reduce((arr, account_details) => {
      account_details[1] === AccountTypes.Individual ? arr.push(account_details[0]) : arr;
      return arr;
    }, []);
    const business_accounts_ids: string[] = accounts_details.reduce((arr, account_details) => {
      account_details[1] === AccountTypes.Business ? arr.push(account_details[0]) : arr;
      return arr;
    }, []);
    const family_accounts_ids: string[] = accounts_details.reduce((arr, account_details) => {
      account_details[1] === AccountTypes.Family ? arr.push(account_details[0]) : arr;
      return arr;
    }, []);

    validation_queue.push([validator.checkRequiredFieldsExist(payload, ['accounts_details', 'action']), new InvalidArgumentsError('Some of the required values are not inserted')]);
    validation_queue.push([!validator.isEmptyArray(accounts_details), new InvalidArgumentsError('accounts_ids list should not be empty')]);
    validation_queue.push([accountValidationUtils.isValidIds(accounts_ids), new InvalidArgumentsError('there is an account id that is not numeric')]);
    validation_queue.push([family_accounts_ids.length === 0, new InvalidArgumentsError(`it's impossible to change status of family accounts`)]);

    validationCheck(validation_queue);

    accounts = [...accounts, ...(await businessAccountRepository.getBusinessAccountsByAccountIds(business_accounts_ids))];
    accounts = [...accounts, ...(await individualAccountService.getIndividualAccountsByAccountIds(individual_accounts_ids))];

    validation_queue.push([accountValidationUtils.isActionOppositeForAll(accounts, payload.action as AccountStatuses), new InvalidArgumentsError(`Some of the accounts has ${payload.action} status`)]);

    validationCheck(validation_queue);
  }

  async transfer(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];
    const accounts_ids: string[] = [payload.source_account_id, payload.destination_account_id];

    validation_queue.push([accounts_ids[0] !== accounts_ids[1], new InvalidArgumentsError(`it's impossible to make a transfer to yourself`)]);

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, ['source_account_id', 'destination_account_id', 'amount', 'transfer']),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([accountValidationUtils.isValidIds(accounts_ids), new InvalidArgumentsError('One of the ids is not valid')]);

    validationCheck(validation_queue);

    const accounts: IAccount[] = await accountRepository.getAccountsByAccountIds(accounts_ids);
    const is_same_currency_transfer = TransferTypes.same_currency === payload.transfer;
    const is_both_accounts_with_same_currency = accountValidationUtils.isAllWithSameCurrency(accounts[0].currency, accounts);

    validation_queue.push([accountValidationUtils.isAllAccountsWithSameStatus(accounts, AccountStatuses.active), new InvalidArgumentsError(`One or more of the accounts are not active`)]);

    validation_queue.push([accountValidationUtils.isTransferOptionValid(payload.transfer), new InvalidArgumentsError(`Chosen transfer type is invalid`)]);

    validation_queue.push([
      (is_same_currency_transfer && is_both_accounts_with_same_currency) || (!is_same_currency_transfer && !is_both_accounts_with_same_currency),
      new InvalidArgumentsError(`Chosen transfer type is not possible by the accounts currency`),
    ]);

    validation_queue.push([validator.isNumberPositive(Number(payload.amount)), new InvalidArgumentsError(`Transfer amount is not a positive number`)]);

    validationCheck(validation_queue);
  }
}

const accountValidator = new AccountValidator();
export default accountValidator;
