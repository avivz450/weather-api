import { IGeneralObj } from '../types/general.types.js';
import { AccountTypes } from '../types/account.types.js';
import validator from '../utils/validator.js';
import accountValidationUtils from '../utils/account.validator.js';
import validationCheck from '../utils/validation.utils.js';
import ValidationDetails from '../types/validation.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import accountValidator from './account.valdation.js';
import businessAccountService from '../services/businessAccount.service.js';
import individualAccountService from '../services/individualAccount.service.js';
class BusinessAccountValidator {
  private readonly company_id_length = 8;
  private readonly min_amount_of_balance = 10000;

  creation(payload: IGeneralObj) {
    const businessRequiredFields = ['company_id', 'company_name', 'currency', 'agent_id'];
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([
      validator.checkRequiredFieldsExist(payload, businessRequiredFields),
      new InvalidArgumentsError('Some of the required values are not inserted'),
    ]);

    validation_queue.push([
      validator.checkFieldsNotExist(payload, ['account_id']),
      new InvalidArgumentsError('account_id should not be inserted'),
    ]);

    validation_queue.push([
      accountValidationUtils.isValidId(String(payload.company_id), this.company_id_length),
      new InvalidArgumentsError(`id must be made of ${this.company_id_length} numbers`),
    ]);

    validationCheck(validation_queue);
  }

  async transferToBusiness(payload: IGeneralObj) {
    await accountValidator.transfer(payload);

    const validation_queue: ValidationDetails[] = [];
    const source_account = await businessAccountService.getBusinessAccount(
      payload.source_account_id,
    );
    const destination_account = await businessAccountService.getBusinessAccount(
      payload.destination_account_id,
    );

    validation_queue.push([
      accountValidationUtils.isExist([source_account], 1),
      new InvalidArgumentsError(`Source account is not a business account`),
    ]);

    validation_queue.push([
      accountValidationUtils.isExist([destination_account], 1),
      new InvalidArgumentsError(`Destionation account is not a business account`),
    ]);

    validation_queue.push([
      accountValidationUtils.isBalanceAllowsTransfer(
        source_account,
        Number(payload.amount),
        AccountTypes.Business,
      ),
      new InvalidArgumentsError(
        `Balance after transaction will be below the minimal remiaining balance of business account`,
      ),
    ]);

    validationCheck(validation_queue);
  }

  async transferToIndividual(payload: IGeneralObj) {
    await accountValidator.transfer(payload);

    const validation_queue: ValidationDetails[] = [];
    const source_account = await businessAccountService.getBusinessAccount(
      payload.source_account_id,
    );
    const destination_account = await individualAccountService.getIndividualAccountByAccountId(
      payload.destination_account_id,
    );

    validation_queue.push([
      accountValidationUtils.isExist([source_account], 1),
      new InvalidArgumentsError(`Source account is not a business account`),
    ]);

    validation_queue.push([
      accountValidationUtils.isExist([destination_account], 1),
      new InvalidArgumentsError(`Destionation account is not an individual account`),
    ]);

    validation_queue.push([
      accountValidationUtils.isBalanceAllowsTransfer(
        source_account,
        Number(payload.amount),
        AccountTypes.Business,
      ),
      new InvalidArgumentsError(
        `Balance after transaction will be below the minimal remiaining balance of business account`,
      ),
    ]);

    validationCheck(validation_queue);
  }

  get minAmountOfBalance() {
    return this.min_amount_of_balance;
  }
}

const businessAccountValidator = new BusinessAccountValidator();
export default businessAccountValidator;
