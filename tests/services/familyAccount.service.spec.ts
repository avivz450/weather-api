import { expect, assert } from 'chai';
import sinon from 'sinon';
import {
  AccountStatuses,
  IAccount,
  IFamilyAccount,
  IFamilyAccountCreationInput,
  IIndividualAccount,
  IndividualTransferDetails,
  ITransferRequest,
  ITransferResponse,
} from '../../src/types/account.types.js';
import logicError from '../../src/exceptions/logic.exception.js';
import genericFunctions from '../../src/utils/generic.functions.js';
import transferRepository from '../../src/repositories/transfer.repository.js';
import familyAccountRepository from '../../src/repositories/familyAccount.repository.js';
import familyAccountService, { FamilyAccountService } from '../../src/services/familyAccount.service.js';
import accountRepository from '../../src/services/db_service/account';
import familyAccountValidator from '../../src/modules/familyAccount.validation.js';

describe('#family account service module', function () {
  context('createFamilyAccount', function () {
    const obj_input = {};
    const obj_output = {};

    this.afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(familyAccountService.createFamilyAccount).to.be.a('function');
    });

    it('success- return new family account', async () => {
      sinon.stub(familyAccountRepository, 'createFamilyAccount').resolves('1');
      sinon.stub(familyAccountService, 'addIndividualAccountsToFamilyAccount').resolves(obj_output as IFamilyAccount);
      expect(await familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput)).to.deep.equal(obj_output);
    });

    it('faild- throw error create individual account', async () => {
      sinon.stub(familyAccountRepository, 'createFamilyAccount').resolves(undefined);
      sinon.stub(familyAccountService, 'addIndividualAccountsToFamilyAccount').resolves(obj_output as IFamilyAccount);
      expect(await familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput)).to.deep.equal(obj_output);
      try {
        familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput);
      } catch (error: any) {
        expect(error.message).to.be.equal('Logic Error:create family account faild');
      }
    });
  });

  context('removeIndividualAccountsFromFamilyAccount', function () {
    const account_success = {
      balance: 4000,
      owners: ['2', '7']
    };
    const account_failed_1 = {
      balance: 500,
      owners: ['2', '7']
    };

    const account_failed_2 = {
        balance: 4000,
        owners: ['2', '7', '8']
      };

    const family_account = {};
    const individual_accounts_details: IndividualTransferDetails[] = [
      ['2', 300],
      ['7', 400],
    ];

    afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(familyAccountService.removeIndividualAccountsFromFamilyAccount).to.be.a('function');
    });

    it('success- remove all individual', async () => {
      const get_family = sinon.stub(familyAccountService, 'getFamilyAccountById')
      get_family.onCall(0).resolves(account_success as IFamilyAccount);
      sinon.stub(familyAccountRepository, 'removeIndividualAccountsFromFamilyAccount').resolves(true);
      sinon.stub(familyAccountRepository, 'transferFromFamilyAccountToIndividualAccounts').resolves(true);
      get_family.onCall(1).resolves(family_account as IFamilyAccount);
      expect(await familyAccountService.removeIndividualAccountsFromFamilyAccount('1', individual_accounts_details)).to.deep.equal(family_account);
    });

    it('failed- amount to remove bigger then the balance in the family account', async () => {
        sinon.stub(familyAccountService, 'getFamilyAccountById').resolves(account_failed_1 as IFamilyAccount);
      try {
        await familyAccountService.removeIndividualAccountsFromFamilyAccount('1', individual_accounts_details);
      } catch (error: any) {
        expect(error.message).to.be.equal(`Transfer Error : family account can't remain with negative amount of coins`);
      }
    });

    it('failed- cant leave active account with people under 5000t', async () => {
      sinon.stub(familyAccountService, 'getFamilyAccountById').resolves(account_failed_2 as IFamilyAccount);
      try {
        await familyAccountService.removeIndividualAccountsFromFamilyAccount('1', individual_accounts_details);
      } catch (error: any) {
        expect(error.message).to.be.equal(`Transfer Error : family account with connected individual accounts must remain with at least ${familyAccountValidator.minAmountOfBalance} coins`);
      }
    });
  });

  context('transferFamilyToBusiness', function () {
    const transfer_request: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 500,
    };
    const transfer_request_2: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 6000,
    };

    const transfer_response: ITransferResponse = {
      source_account: {},
      destination_account: {},
    };

    afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(familyAccountService.transferFamilyToBusiness).to.be.a('function');
    });

    it('success- transfer success', async () => {
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
      expect(await familyAccountService.transferFamilyToBusiness(transfer_request)).to.deep.equal(transfer_response);
    });

    it('failed- amount over 5000', async () => {
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
      try {
        await familyAccountService.transferFamilyToBusiness(transfer_request_2);
      } catch (error: any) {
        expect(error.message).to.be.equal(`Transfer Error : transaction from family account to business account is limited to ${familyAccountService.transaction_limit_business_to_individual} coins`);
      }
    });

    it('failed- transfer failed', async () => {
      sinon.stub(transferRepository, 'transfer').resolves(undefined);
      try {
        await familyAccountService.transferFamilyToBusiness(transfer_request);
      } catch (error: any) {
        expect(error.message).to.be.equal('Transfer Error : transfer failed');
      }
    });
  });

  context('closeFamilyAccount', function () {
    const owners_id: string[] = [];
    const owners_id_2 = ['1'];

    const success = {status: "success"}
    afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(familyAccountService.closeFamilyAccount).to.be.a('function');
    });

    it('success- close account', async () => {
      sinon.stub(familyAccountRepository, 'getOwnersByFamilyAccountId').resolves(owners_id);
      sinon.stub(accountRepository, 'changeAccountsStatusesByAccountIds');
      expect(await familyAccountService.closeFamilyAccount('5')).to.deep.equal(success);
    });

    it('failed- family account cant be closed with individual accounts connected to it', async () => {
      sinon.stub(familyAccountRepository, 'getOwnersByFamilyAccountId').resolves(owners_id_2);
      try {
        await familyAccountService.closeFamilyAccount('5');
      } catch (error: any) {
        expect(error.message).to.be.equal(`Logic Error : family account can't be closed with individual accounts connected to it`);
      }
    });
  });
});
