import {
  IAccount,
  AccountStatuses,
  IIndividualAccount,
  DetailsLevel,
} from '../types/account.types.js';

class AccountValidator {
  isDetailsLevelValid = (details_level: string) => Object.values(DetailsLevel).includes(details_level);

  isAllIdsValid = (idsArr: string[]) => idsArr.every(id => this.isValidId(id));

  isValidId = (id: string, id_length?: number) => {
    if (id === undefined) {
      return false;
    }
    return id_length ? id.length === id_length && /^\d+$/.test(id) : /^\d+$/.test(id);
  };

  isAllAccountsActive = (accounts: IAccount[]) =>
    accounts.every(account => (account.status === AccountStatuses.active ? true : false));

  isAllWithSameCurrency = (currency: string, accounts: IAccount[]) =>
    accounts.every(account => account.currency === currency);

  isExist = (accounts: IAccount[], amount: number) => {
    const numberOfExistAccounts: number = accounts.reduce((acc, account) => {
      return account !== null ? acc + 1 : acc;
    }, 0);

    return numberOfExistAccounts === amount;
  };
}

const accountValidator = new AccountValidator();

export default accountValidator;
