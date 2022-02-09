import { AccountTypes, IAccount, AccountStatuses } from '../types/account.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';

class AccountValidator {
  isValidId(id: string, id_length: number) {
    return id.length === id_length && /^\d+$/.test(id);
  }

  isActive(accounts: IAccount[]) {
    let not_active_account_id: string = '';
    const isAllActive = accounts.every(account => {
      if (account.status !== AccountStatuses.active) {
        not_active_account_id = account.account_id;
        return false;
      }
      return true;
    });

    if (!isAllActive) {
      throw new InvalidArgumentsError(`account with the id ${not_active_account_id} is not active`);
    }
    return true;
  }

  //   isTypeOf(types: AccountTypes[], accounts: IAccount[]) {
  //     const result = accounts.every(account => types.some(type => type === account.type));
  //     if (result) {
  //       return true;
  //     }
  //     throw new InvalidArgumentsError(`is not type of ${types[0]}`);
  //   }

  isAllWithSameCurrency(currency: string, accounts: IAccount[]) {
    let different_currency_account_id: string = '';
    const isSameCurrency = accounts.every(account => {
      if (account.currency !== currency) {
        different_currency_account_id = account.account_id;
        return false;
      }
      return true;
    });
    if (!isSameCurrency) {
      throw new InvalidArgumentsError(
        `account with the id ${different_currency_account_id} has different currency`,
      );
    }
    return true;
  }

  isExist(accounts: IAccount[], amount: number) {
    const numberOfExistAccounts: number = accounts.reduce((acc, account) => {
      return account !== null ? acc + 1 : acc;
    }, 0);

    return numberOfExistAccounts === amount;
  }
}

const accountValidator = new AccountValidator();

export default accountValidator;
