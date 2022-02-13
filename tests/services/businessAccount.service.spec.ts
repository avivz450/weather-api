import { expect, assert } from 'chai';
import sinon from 'sinon';
import PubSub from 'pubsub-js';
import businessAccountService  from "../../src/services/businessAccount.service.js"

describe('The business account service module', function () {

  context('create business account'),function () {

    it("should be defined", () => {
        // @ts-ignore
        assert.isDefined(businessAccountService.createBusinessAccount());
      });
    ​
    it("should be a function", () => {
        // @ts-ignore
        assert.isFunction(businessAccountService.createBusinessAccount());
      });

    }    
});
