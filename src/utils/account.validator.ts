import { IAccount, AccountStatuses } from '../types/account.types.js';

class AccountValidator {
  isValidId = (id: string, id_length?: number) => {
    if(id === undefined){
      return false;
    }
    return id_length ? id.length === id_length && /^\d+$/.test(id) : /^\d+$/.test(id);
  }

  isActive = (accounts: IAccount[]) =>
    accounts.every(account => (account.status === AccountStatuses.active ? true : false));

  isAllWithSameCurrency = (currency: string, accounts: IAccount[]) =>
    accounts.every(account => (account.currency === currency ? true : false));

  isExist = (accounts: IAccount[], amount: number) => {
    const numberOfExistAccounts: number = accounts.reduce((acc, account) => {
      return account !== null ? acc + 1 : acc;
    }, 0);

    return numberOfExistAccounts === amount;
  };
}

const accountValidator = new AccountValidator();

export default accountValidator;
