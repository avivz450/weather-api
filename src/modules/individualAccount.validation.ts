import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import ValidationDetails from '../types/validation.types.js';
import validator from '../utils/validator.js';
import accountValidationUtils from '../utils/account.validator.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
import validationCheck from '../utils/validation.utils.js';
class IndividualAccountValidator {
  private readonly individual_id_length = 7;
  private readonly min_amount_of_balance = 1000;

  async creation(payload: IGeneralObj) {
    const individual_required_fields = ['individual_id', 'first_name', 'last_name', 'currency', 'agent_id'];
    const validation_queue: ValidationDetails[] = [];

    validation_queue.push([validator.checkRequiredFieldsExist(payload, individual_required_fields), new InvalidArgumentsError('Some of the required values are not inserted')]);

    validation_queue.push([validator.checkValidAddress(payload.address), new InvalidArgumentsError(`Invalid address input - address must be with country_code, city, street_name, and street_number or not inserted at all`)]);

    validation_queue.push([validator.checkFieldsNotExist(payload, ['account_id']), new InvalidArgumentsError('account_id should not be inserted')]);

    validation_queue.push([
      accountValidationUtils.isValidId(String(payload.individual_id), this.individual_id_length),
      new InvalidArgumentsError(`id must be made of ${this.individual_id_length} numbers`),
    ]);

    validationCheck(validation_queue);

    const [individualAccount] = await individualAccountService.getIndividualAccountsByIndividualIds([payload.individual_id] as string[]);

    validation_queue.push([!accountValidationUtils.isExist([individualAccount]), new InvalidArgumentsError(`There is already a user with the input id in the system`)]);

    validationCheck(validation_queue);
  }

  get minAmountOfBalance() {
    return this.min_amount_of_balance;
  }

  get individualIdLength() {
    return this.individual_id_length;
  }
}

const individualAccountValidator = new IndividualAccountValidator();
export default individualAccountValidator;
