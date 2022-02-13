import { expect, assert } from 'chai';
//import sinon from 'sinon';
//import PubSub from 'pubsub-js';
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
      const exist = validator.checkRequiredFieldsExist(obj,["id","name"]);
      expect(exist).to.be.eq(true)
    });
    //    it("should sum of many numbers", ()=> {
    //        const mySum=sum(1,2,3,4);
    //        expect(mySum).to.equal(10);

    //    });
    //    it("should exists", ()=> {
    //        expect(multiply).to.be.a("function");
    //        expect(multiply).to.be.instanceOf(Function);
    //    });

    //      it("should multiply the elements of the array with the multiplier", ()=> {
    //        const mymultiply=multiply(2,[1,2]);
    //        expect(mymultiply).to.eql([2,4]);

    //    });
    //    it("should multiply many numbers", ()=> {
    //        const mymultiply=multiply(2,[2,3,4,3]);
    //        expect(mymultiply).to.eql([4,6,8,6]);

    //    });
  });
});
