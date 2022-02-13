import { expect, assert } from 'chai';
import sinon from 'sinon';
import PubSub from 'pubsub-js';
import validator from '../../src/utils/validator.js';
import { IGeneralObj } from '../../src/types/general.types.js';


describe('#validator module', function () {
  context('check Required Fields Exist', () => {
      
    it('should exists', () => {
      // @ts-ignore
      expect(validator.checkRequiredFieldsExist()).to.be.a('function');
    });

    it('should return true if all required fields exist', () => {
      const obj:IGeneralObj = {
        "id":123,
        "name":"renana"
      }
      const keys = ["id","name"];
      const exist = validator.checkRequiredFieldsExist(obj,keys);
      expect(exist).to.be.true;
    });

  });
});
