import individualAccountService from '../services/individualAccount.service.js';
import { IGeneralObj } from '../types/general.types.js';
import { IIndividualAccount, IndividualTransferDetails } from '../types/account.types.js';
import validator from '../utils/validator.js';
import accountValidator from '../utils/account.validator.js';
import { IndividualAccountValidator } from './individualAccount.validation.js';
class FamilyAccountValidator {
  async creation(payload: IGeneralObj) {
    const familyRequiredFields = ['currency', 'individual_accounts_details'];
    const individual_accounts_details: IndividualTransferDetails[] = payload.individual_accounts_details ;
    const individual_accounts: IIndividualAccount[] = await individualAccountService.getIndividualAccountsByAccountIds(individual_accounts_details.map(account_details => account_details[0]));
    const individual_accounts_balance_after_transfer: IGeneralObj = individualAccountService.getIndividualAccountsRemainingBalance(individual_accounts, individual_accounts_details);

    validator.checkRequiredFieldsExist(payload, familyRequiredFields);
    validator.checkFieldsNotExist(payload, ['account_id']);
    accountValidator.isExist(individual_accounts, individual_accounts.length);
    accountValidator.isActive(individual_accounts);
    accountValidator.isAllWithSameCurrency(payload.currency, individual_accounts);
    validator.isSumAboveMinAmount(
      5000,
      individual_accounts_details.map(individual_account => individual_account[1]),
    );
    validator.isEachAboveMinAmount(1000, Object.values(individual_accounts_balance_after_transfer));
  }
}

const familyAccountValidator = new FamilyAccountValidator();
export default familyAccountValidator;