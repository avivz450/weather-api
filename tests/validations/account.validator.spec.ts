import { expect, assert } from 'chai';
import accountValidationUtils from '../../src/utils/account.validator.js';
import { AccountStatuses, AccountTypes, IAccount, IndividualTransferDetails } from '../../src/types/account.types.js';
import sinon from 'sinon';

describe('#Validation account module', function () {

  context('isValidArrayOfTransfer', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isValidArrayOfTransfer).to.be.a('function');
    });

    it('success- return true if array input is valid array of transfer', () => {
        const individual_accounts_details:IndividualTransferDetails[]=[["1",300],["2",400]];
        expect(accountValidationUtils.isValidArrayOfTransfer(individual_accounts_details)).to.be.true;
    });

    it('failed - return false if array input is not valid array of transfer', () => {
      const individual_accounts_details_2:any[]=[["1","12"]];
      expect(accountValidationUtils.isValidArrayOfTransfer(individual_accounts_details_2)).to.be.false;
    });
  });

  context('isBalanceAllowsTransfer', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isBalanceAllowsTransfer).to.be.a('function');
    });

    it('success- return true if the balance allows transfer', () => {
      const account = { balance : 10500 }
      const transfer_amount = 500
      expect(accountValidationUtils.isBalanceAllowsTransfer(account as IAccount, transfer_amount,AccountTypes.Business)).to.be.true;
    });

    it('failed- should return false the balance dont allows transfer', () => {
      const account = { balance : 10500 }
      const transfer_amount = 1000
      expect(accountValidationUtils.isBalanceAllowsTransfer(account as IAccount, transfer_amount,AccountTypes.Business)).to.be.false;
    });
  });

  context('isActionOppositeForAll', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isActionOppositeForAll).to.be.a('function');
    });

    it('success- return true if action opposite for all', () => {
      const accounts = [{status:AccountStatuses.active},{status:AccountStatuses.active}]
      expect(accountValidationUtils.isActionOppositeForAll(accounts as IAccount[], AccountStatuses.inactive)).to.be.true;
    });
 
    it('failed- should return false if action dont opposite for all', () => {
      const accounts = [{status:AccountStatuses.inactive},{status:AccountStatuses.active}]
      expect(accountValidationUtils.isActionOppositeForAll(accounts as IAccount[], AccountStatuses.inactive)).to.be.false;
    });
  });
  
  context('isDetailsLevelValid', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isDetailsLevelValid).to.be.a('function');
    });

    it('success- return true if value valid details level  ', () => {
      expect(accountValidationUtils.isDetailsLevelValid("full")).to.be.true;
    });
   
    it('failed- should return false if value invalid details level', () => {
      expect(accountValidationUtils.isDetailsLevelValid("bla")).to.be.false;
    });
  });

  context('isTransferOptionValid', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isTransferOptionValid).to.be.a('function');
    });

    it('success- return true if value is transfer option valid', () => {
      expect(accountValidationUtils.isTransferOptionValid("transfer")).to.be.true;
    });

    it('failed- should return false if value invalid details level', () => {
      expect(accountValidationUtils.isTransferOptionValid("bla")).to.be.false;
    });
  });

  context('isValidIds', () => {
    afterEach(() => {
          // Restore the default sandbox here
          sinon.restore();
        });
    it('should exists', () => {
      expect(accountValidationUtils.isValidIds).to.be.a('function');
    });

    it('success- return true if input values valid', () => {
      sinon.stub(accountValidationUtils, 'isValidId').returns(true);
      expect(accountValidationUtils.isValidIds(["1000000","3444444"])).to.be.true;
    });
    it('failed -return false if input value invalid', () => {
      sinon.stub(accountValidationUtils, 'isValidId').returns(false);
      expect(accountValidationUtils.isValidIds(["1000000","3444444"])).to.be.false;
      });
  });

  context('isAllWithSameCurrency', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isAllWithSameCurrency).to.be.a('function');
    });

    it('success- return true if all accounts with same currency', () => {
      const accounts = [{currency:"EUR"},{currency:"EUR"}]
      expect(accountValidationUtils.isAllWithSameCurrency("EUR",accounts as IAccount[])).to.be.true;
    });
  
    it('failed- return false if not all accounts with same currency', () => {
      const accounts = [{currency:"EUR"},{currency:"USD"}]
      expect(accountValidationUtils.isAllWithSameCurrency("USD",accounts as IAccount[])).to.be.false;
    });
  });


  context('isAllAccountsWithSameStatus', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isAllAccountsWithSameStatus).to.be.a('function');
    });

    it('success- return true if all accounts with same status', () => {
      const accounts = [{status:"active"},{status:"active"}]
      expect(accountValidationUtils.isAllAccountsWithSameStatus(accounts as IAccount[],AccountStatuses.active)).to.be.true;
    });
 
    it('failed- should return false if not all accounts with same status', () => {
      const accounts = [{status:"active"},{status:"inactive"}]
      expect(accountValidationUtils.isAllAccountsWithSameStatus(accounts as IAccount[],AccountStatuses.active)).to.be.false;
    });
  });

  context('isExist', () => {
    it('should exists', () => {
      expect(accountValidationUtils.isExist).to.be.a('function');
    });

    it('success- return true ', () => {
      const accounts_ids = ["1","2","3"]
      expect(accountValidationUtils.isExist(accounts_ids)).to.be.true;
    });
 
    it('failed- should return false ', () => {
      const accounts_ids = ["1","2",undefined]
      expect(accountValidationUtils.isExist(accounts_ids)).to.be.false;
    });
  });

});
