import { IGeneralObj } from '../types/general.types.js';

class Validator {
  checkValidAddress = (address: any) => {
    if (address === undefined) {
      return true;
    } else {
      const address_keys = Object.keys(address);
      console.log(address_keys);
      return address_keys.includes('country_code') && address_keys.includes('city') && address_keys.includes('street_name') && address_keys.includes('street_number');
    }
  };
  checkRequiredFieldsExist = (obj: IGeneralObj, mandatory_keys: string[]) => mandatory_keys.every(key => key in obj);

  checkFieldsNotExist = (obj: IGeneralObj, mandatory_keys: string[]) => mandatory_keys.every(key => !(key in obj));

  isNumeric = (value: unknown) => /^[0-9]+$/.test(String(value));

  isAllNumbersPositive = (numbersArr: number[]) => numbersArr.every(number => number > 0);

  isNumberPositive = (number: number) => number > 0;

  isEmptyArray = (array: any[]) => array.length === 0;

  isSumAboveMinAmount = (min: number, amounts: number[]) => amounts.reduce((sum, amount) => sum + amount, 0) >= min;

  isEachAboveMinAmount = (min: number, amounts: number[]) => amounts.every(amount => amount >= min);
}

const validator = new Validator();

export default validator;
