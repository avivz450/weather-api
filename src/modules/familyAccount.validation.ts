import individualAccountService from '../services/individualAccount.service.js';
import familyAccountService from '../services/familyAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import {
  IIndividualAccount,
  IndividualTransferDetails,
  IFamilyAccount,
  DetailsLevel,
} from '../types/account.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';
import ValidationDetails from '../types/validation.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception';
import validationCheck from '../utils/validation.utils';
import FamilyAccountRepository from "../repositories/familyAccount.repository";

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
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, familyRequiredFields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validation_queue.push([
      accountValidator.isExist(individual_accounts, individual_accounts.length),
      new InvalidArgumentsError(`Some of the individual accounts are not exist`),
    ]);

    validation_queue.push([
      accountValidator.isAllAccountsActive(individual_accounts),
      new InvalidArgumentsError(`Some of the individual accounts are not active`),
    ]);

    validation_queue.push([
      accountValidator.isAllWithSameCurrency(payload.currency, individual_accounts),
      new InvalidArgumentsError(`Some of the accounts have different currencies`),
    ]);

    validation_queue.push([
      validator.isSumAboveMinAmount(
        this.minAmountOfFamilyAccount,
        individual_accounts_details.map(individual_account => individual_account[1]),
      ),
      new InvalidArgumentsError(
        `the sum of the amounts didn't pass the minimum of ${this.minAmountOfFamilyAccount}`,
      ),
    ]);

    validation_queue.push([
      validator.isEachAboveMinAmount(
        this.minAmountOfIndividualTransaction,
        Object.values(individual_accounts_balance_after_transfer),
      ),
      new InvalidArgumentsError(
        `the sum of the amounts didn't pass the minimum of ${this.minAmountOfIndividualTransaction}`,
      ),
    ]);

    validationCheck(validation_queue);
  }

  get(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      accountValidator.isValidId(payload.id),
      new InvalidArgumentsError(`primary_id must be inserted with numeric characters.`),
    ]);

    validationCheck(validation_queue);
  }

  async addIndividualAccount(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];
    const individual_accounts_ids = (payload.individual_accounts as string[]).map(
      individual_id_amount_tuple => individual_id_amount_tuple[0],
    );
    const individual_accounts_amounts = (payload.individual_accounts as string[]).map(
      individual_id_amount_tuple => parseInt(individual_id_amount_tuple[1]),
    );
    const individual_accounts: IIndividualAccount[] =
      await individualAccountService.getIndividualAccountsByAccountIds(individual_accounts_ids);
    const [family_account]: IFamilyAccount =
      await familyAccountService.getFamilyAccountsByAccountIds(
        payload.account_id,
        DetailsLevel.full,
      );

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, ['account_id', 'details_level', 'individual_accounts']),
      new InvalidArgumentsError('Some of the required fields are not inserted'),
    ]);

    validation_queue.push([
      accountValidator.isDetailsLevelValid(payload.details_level),
      new InvalidArgumentsError('details_level is not valid'),
    ]);

    validation_queue.push([
      accountValidator.isValidId(payload.account_id),
      new InvalidArgumentsError('account_id must be numeric'),
    ]);

    validation_queue.push([
      validator.isEmptyArray(payload.individual_accounts),
      new InvalidArgumentsError('individual_accounts list should not be empty'),
    ]);

    validation_queue.push([
      validator.isAllNumbersPositive(individual_accounts_amounts),
      new InvalidArgumentsError(`Some of the inserted amounts are not positive`),
    ]);

    validation_queue.push([
      accountValidator.isAllIdsValid(individual_accounts_ids),
      new InvalidArgumentsError('there is an individual account_id that is not numeric'),
    ]);

    validation_queue.push([
      accountValidator.isAllWithSameCurrency(family_account.currency, individual_accounts),
      new InvalidArgumentsError(
        `some of the accounts don't have the same currency as the currency in the family account`,
      ),
    ]);

    validation_queue.push([
      accountValidator.isAllAccountsActive(individual_accounts),
      new InvalidArgumentsError(`Some of the individual accounts are not active`),
    ]);

    validationCheck(validation_queue);
  }

  async removeIndividualAccount(payload: IGeneralObj) {
    const validation_queue: ValidationDetails[] = [];
    const individual_accounts_ids = (payload.individual_accounts as string[]).map(
      individual_id_amount_tuple => individual_id_amount_tuple[0],
    );
    const individual_accounts_amounts = (payload.individual_accounts as string[]).map(
      individual_id_amount_tuple => parseInt(individual_id_amount_tuple[1]),
    );
    const connected_individuals_to_family = await FamilyAccountRepository.getOwnersByAccountId(payload.account_id);

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, ['account_id', 'individual_accounts']),
      new InvalidArgumentsError('Some of the required fields are not inserted'),
    ]);

    validation_queue.push([
      accountValidator.isValidId(payload.account_id),
      new InvalidArgumentsError('account_id must be numeric'),
    ]);

    validation_queue.push([
      validator.isEmptyArray(payload.individual_accounts),
      new InvalidArgumentsError('individual_accounts list should not be empty'),
    ]);

    validation_queue.push([
      validator.isAllNumbersPositive(individual_accounts_amounts),
      new InvalidArgumentsError(`Some of the inserted amounts are not positive`),
    ]);

    validation_queue.push([
      accountValidator.isAllIdsValid(individual_accounts_ids),
      new InvalidArgumentsError('there is an individual account_id that is not numeric'),
    ]);

    validation_queue.push([
      individual_accounts_ids.every(individual_id => connected_individuals_to_family.includes(individual_id)),
      new InvalidArgumentsError('there is an individual account id that is not connected to family id'),
    ]);

    validationCheck(validation_queue);
  }
}

const familyAccountValidator = new FamilyAccountValidator();
export default familyAccountValidator;