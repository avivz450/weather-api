import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import { IIndividualAccount, IndividualTransferDetails } from '../types/account.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';
import ValidationDetails from '../types/validation.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception';
import validationCheck from '../utils/validation.utils';

class FamilyAccountValidator {
  readonly minAmountOfFamilyAccount = 5000;
  readonly minAmountOfIndividualTransaction = 1000;

  async creation(payload: IGeneralObj) {
    const familyRequiredFields = ['currency', 'individual_accounts_details'];
    const individual_accounts_details: IndividualTransferDetails[] =
      payload.individual_accounts_details;
    const individual_accounts: IIndividualAccount[] =
      await individualAccountService.getIndividualAccountsByAccountIds(
        individual_accounts_details.map(account_details => account_details[0]),
      );
    const individual_accounts_balance_after_transfer: IGeneralObj =
      individualAccountService.getIndividualAccountsRemainingBalance(
        individual_accounts,
        individual_accounts_details,
      );
    const validationQueue: ValidationDetails[] = [];

    validationQueue.push([
      validator.checkRequiredFieldsExist(payload, familyRequiredFields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validationQueue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validationQueue.push([
      accountValidator.isExist(individual_accounts, individual_accounts.length),
      new InvalidArgumentsError(`Some of the individual accounts are not exist`),
    ]);

    validationQueue.push([
      accountValidator.isActive(individual_accounts),
      new InvalidArgumentsError(`Some of the individual accounts are not active`),
    ]);

    validationQueue.push([
      accountValidator.isAllWithSameCurrency(payload.currency, individual_accounts),
      new InvalidArgumentsError(`Some of the accounts have different currencies`),
    ]);

    validationQueue.push([
      validator.isSumAboveMinAmount(
        this.minAmountOfFamilyAccount,
        individual_accounts_details.map(individual_account => individual_account[1]),
      ),
      new InvalidArgumentsError(
        `the sum of the amounts didn't pass the minimum of ${this.minAmountOfFamilyAccount}`,
      ),
    ]);

    validationQueue.push([
      validator.isEachAboveMinAmount(
        this.minAmountOfIndividualTransaction,
        Object.values(individual_accounts_balance_after_transfer),
      ),
      new InvalidArgumentsError(
        `the sum of the amounts didn't pass the minimum of ${this.minAmountOfIndividualTransaction}`,
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

const familyAccountValidator = new FamilyAccountValidator();
export default familyAccountValidator;
