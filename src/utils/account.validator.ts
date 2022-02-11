<<<<<<< HEAD
import {IAccount,AccountStatuses,IIndividualAccount,DetailsLevel} from '../types/account.types.js';
import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';

class AccountValidator {
  isDetailsLevelValid = (details_level: DetailsLevel) => Object.values(DetailsLevel).includes(details_level);
=======
import {
  IAccount,
  AccountStatuses,
  IIndividualAccount,
  DetailsLevel,
  AccountTypes,
} from '../types/account.types.js';

class AccountValidationUtils {
  isActionOppositeForAll = (accounts: IAccount[], action: string) =>
    accounts.every(account => account.status !== action);

  isSomeIsType = (accounts: IAccount[], accountType: AccountTypes) =>
    accounts.every(account => account.type === accountType);

  isDetailsLevelValid = (details_level: string) => details_level in DetailsLevel;
>>>>>>> a8734b93e851f8adf2079241157d94973ac8c2ff

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

const accountValidationUtils = new AccountValidationUtils();

export default accountValidationUtils;
