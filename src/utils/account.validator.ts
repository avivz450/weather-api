import {
  IAccount,
  AccountStatuses,
  DetailsLevel,
  AccountTypes,
  TransferTypes,
} from '../types/account.types.js';
import familyAccountValidator from '../modules/familyAccount.validation.js';
import individualAccountValidator from '../modules/individualAccount.validation.js';
import businessAccountValidator from '../modules/businessAccount.validation.js';

class AccountValidationUtils {
  isValidArrayOfTransfer = (individual_accounts_details: any[]) =>
    individual_accounts_details.every(
      account_details =>
        typeof account_details[0] === 'string' && typeof account_details[1] === 'number',
    );

  isBalanceAllowsTransfer(
    account: IAccount,
    transfer_amount: number,
    account_type: AccountTypes,
  ): boolean {
    switch (account_type) {
      case AccountTypes.Individual:
        return account.balance - transfer_amount >= individualAccountValidator.minAmountOfBalance;
        break;
      case AccountTypes.Business:
        return account.balance - transfer_amount >= businessAccountValidator.minAmountOfBalance;
        break;
      case AccountTypes.Family:
        return account.balance - transfer_amount >= familyAccountValidator.minAmountOfBalance;
        break;
    }
  }

  isActionOppositeForAll = (accounts: IAccount[], action: AccountStatuses) =>
    accounts.every(account => account.status !== action);

  // isSomeIsType = (accounts: IAccount[], accountType: AccountTypes) =>
  //   accounts.some(account => account.type === accountType);

  // isAllIsType = (accounts: IAccount[], accountType: AccountTypes) =>
  //   accounts.every(account => account.type === accountType);

  isDetailsLevelValid = (details_level: string) => details_level in DetailsLevel;

  isTransferOptionValid = (transfer_option: string) => transfer_option in TransferTypes;

  isValidIds = (idsArr: string[]) => idsArr.every(id => this.isValidId(id));

  isValidId = (id: string, id_length?: number) => {
    if (id === undefined) {
      return false;
    }
    return id_length ? id.length === id_length && /^\d+$/.test(id) : /^\d+$/.test(id);
  };

  isAllAccountsWithSameStatus = (accounts: IAccount[], status: AccountStatuses) =>
    accounts.every(account => account.status === status);

  isAllWithSameCurrency = (currency: string, accounts: IAccount[]) =>
    accounts.every(account => account.currency === currency);

  isExist = (accounts: IAccount[], amount: number) => {
    const numberOfExistAccounts: number = accounts.reduce((acc, account) => {
      return account !== undefined ? acc + 1 : acc;
    }, 0);

    return numberOfExistAccounts === amount;
  };
}

const accountValidationUtils = new AccountValidationUtils();

export default accountValidationUtils;
