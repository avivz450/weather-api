import { IGeneralObj } from '../types/general.types.js';

class Validator {
  checkRequiredFieldsExist = (obj: IGeneralObj, mandatory_keys: string[]) =>
    mandatory_keys.every(key => (key in obj ? true : false));

  checkFieldsNotExist = (obj: IGeneralObj, mandatory_keys: string[]) =>
    mandatory_keys.every(key => (key in obj ? false : true));

  isNumeric = (key: string, value: unknown) => /^[0-9]+$/.test(String(value));

  isSumAboveMinAmount = (min: number, amounts: number[]) =>
    amounts.reduce((sum, amount) => sum + amount, 0) >= min;

  isEachAboveMinAmount = (min: number, amounts: number[]) => amounts.every(amount => amount >= min);
}

const validator = new Validator();

export default validator;
