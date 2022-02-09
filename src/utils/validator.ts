import InvalidArgumentsError from '../exceptions/InvalidArguments.exception.js';
//import { BalanceTransfer, IAccount } from '../types/accounts.interface.js';
import { IGeneralObj } from '../types/general.types.js';

class Validator {
  public checkRequiredFieldsExist(obj: IGeneralObj, mandatory_keys: string[]) {
    return mandatory_keys.every(key => (key in obj ? true : false));
  }

  public checkFieldsNotExist(obj: IGeneralObj, mandatory_keys: string[]) {
    return mandatory_keys.every(key => (key in obj ? false : true));
  }

  public isPositiveNumber(key: string, num: number) {
    if (num > 0) {
      return true;
    }
    throw new InvalidArgumentsError(`${key} should be a positive number`);
  }

  public isArrayEmpty(key: string, arr: any[]) {
    if (arr.length !== 0) {
      return false;
    }
    throw new InvalidArgumentsError(`${key} should not be empty`);
  }

  // transfer
  //   isLessThan(limit: number, num: number) {
  //     if (num >= limit) {
  //       throw new InvalidArgumentsError(`value is not less then ${limit}`);
  //     }
  //     return true;
  //   }

  //   isGreaterThan(threshold: number, num: number) {
  //     if (num < threshold) {
  //       throw new InvalidArgumentsError(`value is not greater then ${threshold}`);
  //     }
  //     return true;
  //   }

  public isNumeric(key: string, value: unknown) {
    if (/^[0-9]+$/.test(String(value))) {
      return true;
    }
    throw new InvalidArgumentsError(`${key} should be numeric`);
  }

  isSumAboveMinAmount(min: number, amounts: number[]) {
    const isAllAboveMin = amounts.reduce((sum, amount) => sum + amount, 0);

    if (isAllAboveMin >= min) {
      return true;
    }

    throw new InvalidArgumentsError(`the sum of the amounts didn't pass the minimum of ${min}`);
  }

  isEachAboveMinAmount(min: number, amounts: number[]) {
    const isEachAboveMin = amounts.every(amount => amount >= min);

    if (isEachAboveMin == true) {
      return true;
    }

    throw new InvalidArgumentsError(`the sum of the amounts didn't pass the minimum of ${min}`);
  }
}

const validator = new Validator();

export default validator;
