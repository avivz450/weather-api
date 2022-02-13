import { expect, assert } from 'chai';
//import sinon from 'sinon';
//import PubSub from 'pubsub-js';
import businessAccountService  from "../../src/services/businessAccount.service.js"

describe('#Business service', () => {

  context('createBusinessAccount',function () {
    it("should be defined", () => {
        // @ts-ignore
        assert.isDefined(businessAccountService.createBusinessAccount);
      });
    ​
    it("should be a function", () => {
        // @ts-ignore
        assert.isFunction(businessAccountService.createBusinessAccount);
      });

      
      it("should be a function", () => {
        // @ts-ignore
        assert.isFunction(businessAccountService.createBusinessAccount);
      });

    });   

    context('transferBusinessToBusiness',function () {
      it("should be defined", () => {
          // @ts-ignore
          assert.isDefined(businessAccountService.transferBusinessToBusiness);
        });
      ​
      it("should be a function", () => {
          // @ts-ignore
          assert.isFunction(businessAccountService.createBusinessAccount);
        });
        
      
  
      });   
});
