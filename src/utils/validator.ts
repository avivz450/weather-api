import { IGeneralObj } from '../types/general.types.js';

class Validator {
  checkRequiredFieldsExist = (obj: IGeneralObj, mandatory_keys: string[]) =>
    mandatory_keys.every(key => (key in obj));

  checkFieldsNotExist = (obj: IGeneralObj, mandatory_keys: string[]) =>
    mandatory_keys.every(key => (!(key in obj)));

  isNumeric = (value: unknown) => /^[0-9]+$/.test(String(value));

  isAllNumbersPositive = (numbersArr: number[]) => numbersArr.every(number => number > 0);

  isNumberPositive = (number: number) => number > 0;

  isEmptyArray = (array: any[]) => array.length === 0;

  isSumAboveMinAmount = (min: number, amounts: number[]) =>
    amounts.reduce((sum, amount) => sum + amount, 0) >= min;

  isEachAboveMinAmount = (min: number, amounts: number[]) => amounts.every(amount => amount >= min);
}

const validator = new Validator();

export default validator;
