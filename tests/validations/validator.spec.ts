import { expect, assert } from 'chai';
import validator from '../../src/utils/validator.js';
import { IGeneralObj } from '../../src/types/general.types.js';

describe('#validator module', function () {
  context('checkRequiredFieldsExist', () => {
    it('should exists', () => {
      expect(validator.checkRequiredFieldsExist).to.be.a('function');
    });

    it('success- return true if all required fields exist', () => {
      const obj: IGeneralObj = {
        id: 123,
        name: 'renana',
      };
      const keys = ['id', 'name'];
      expect(validator.checkRequiredFieldsExist(obj, keys)).to.be.true;
    });

    it('failed - return false if all required fields not exist', () => {
      const obj: IGeneralObj = {
        id: 123,
        name: 'renana',
      };
      const keys = ['id', 'name', 'email'];
      expect(validator.checkRequiredFieldsExist(obj, keys)).to.be.false;
    });
  });

  context('checkFieldsNotExist', () => {
    it('should exists', () => {
      expect(validator.checkRequiredFieldsExist).to.be.a('function');
    });

    it('success- return true if all required fields not exist', () => {
      const obj: IGeneralObj = {
        id: 123,
        name: 'renana',
      };
      const keys:string[] = [];
      expect(validator.checkFieldsNotExist(obj, keys)).to.be.true;
    });

    it('failed- should return false if at least one required fields exist', () => {
      const obj: IGeneralObj = {
        id: 123,
        name: 'renana',
      };
      const keys = ['id'];
      expect(validator.checkFieldsNotExist(obj, keys)).to.be.false;
    });
  });

  context('isNumeric', () => {
    it('should exists', () => {
      expect(validator.isNumeric).to.be.a('function');
    });

    it('success- return true if string value is numeric', () => {
      expect(validator.isNumeric("8786")).to.be.true;
    });
    it('success- return true if number value is numeric', () => {
        expect(validator.isNumeric(87532)).to.be.true;
      });
    it('failed- should return false if value is not numeric', () => {
      expect(validator.isNumeric("jh898")).to.be.false;
    });
  });
  
  context('isAllNumbersPositive', () => {
    it('should exists', () => {
      expect(validator.isAllNumbersPositive).to.be.a('function');
    });

    it('success- return true if all numbers in array positive', () => {
      expect(validator.isAllNumbersPositive([1,2,3])).to.be.true;
    });
   
    it('failed- should return false if not all numbers in array positive', () => {
      expect(validator.isAllNumbersPositive([-1,3,5])).to.be.false;
    });
  });

  context('isNumberPositive', () => {
    it('should exists', () => {
      expect(validator.isNumberPositive).to.be.a('function');
    });

    it('success- return true if string value is positive', () => {
      expect(validator.isNumberPositive(234)).to.be.true;
    });

    it('failed- should return false if value is not positive', () => {
      expect(validator.isNumberPositive(-2383)).to.be.false;
    });
  });

  context('isEmptyArray', () => {
    it('should exists', () => {
      expect(validator.isEmptyArray).to.be.a('function');
    });

    it('success- return true if input value is empty array', () => {
      expect(validator.isEmptyArray([])).to.be.true;
    });
    it('failed -return true if input value is not empty array', () => {
        expect(validator.isEmptyArray([3,33])).to.be.false;
      });
  });

  context('isSumAboveMinAmount', () => {
    it('should exists', () => {
      expect(validator.isSumAboveMinAmount).to.be.a('function');
    });

    it('success- return true if array sum above min amount', () => {
      expect(validator.isSumAboveMinAmount(10,[1,2,3,10])).to.be.true;
    });
  
    it('failed- return false if array sum not above min amount', () => {
      expect(validator.isSumAboveMinAmount(10,[1,2,3])).to.be.false;
    });
  });


  context('isEachAboveMinAmount', () => {
    it('should exists', () => {
      expect(validator.isEachAboveMinAmount).to.be.a('function');
    });

    it('success- return true if each array values above min amount', () => {
      expect(validator.isEachAboveMinAmount(5,[6,7,8])).to.be.true;
    });
 
    it('failed- should return false if exist array value not above min amount', () => {
      expect(validator.isEachAboveMinAmount(5,[4,5,7])).to.be.false;
    });
  });

});
