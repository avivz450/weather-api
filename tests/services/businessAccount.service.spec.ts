import { expect, assert } from 'chai';
import sinon from 'sinon';
import businessAccountService from '../../src/services/businessAccount.service.js';
import bussinessAccountRepository from '../../src/repositories/bussinessAccount.repository.js';
import { AccountStatuses, IBusinessAccount, ITransferRequest, ITransferResponse } from '../../src/types/account.types.js';
import logicError from '../../src/exceptions/logic.exception.js';
import genericFunctions from '../../src/utils/generic.functions.js';
import transferRepository from '../../src/repositories/transfer.repository.js';

describe('#business account service module', function () {
  context('createBusinessAccount', function () {
    const obj_input: Omit<IBusinessAccount, 'account_id'> = {
      company_id: '10000000',
      company_name: 'Rapyd',
      currency: 'EUR',
      balance: 5000,
      agent_id: '1200',
      status: undefined,
    };
    const obj_output: IBusinessAccount = {
      account_id: '1',
      company_id: '10000000',
      company_name: 'Rapyd',
      currency: 'EUR',
      balance: 5000,
      agent_id: '1200',
      status: AccountStatuses.active,
    };

    this.afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(businessAccountService.createBusinessAccount).to.be.a('function');
    });

    it('success- return new business account', async () => {
      sinon.stub(bussinessAccountRepository, 'createBusinessAccount').resolves('1');
      sinon.stub(businessAccountService, 'getBusinessAccount').resolves(obj_output);
      expect(await businessAccountService.createBusinessAccount(obj_input)).to.deep.equal(obj_output);
    });

    it('failed- throw error create business account', async () => {
      sinon.stub(bussinessAccountRepository, 'createBusinessAccount').resolves('1');
      sinon.stub(businessAccountService, 'getBusinessAccount').resolves(undefined);
      try {
        await businessAccountService.createBusinessAccount(obj_input);
      } catch (error: any) {
        expect(error.message).to.be.equal('Logic Error:create business account failed');
      }
    });
  });

  context('getBusinessAccount', function () {
    const obj_output = {
      account_id: '1',
      company_id: '10000000',
      company_name: 'Rapyd',
      currency: 'EUR',
      balance: 5000,
      agent_id: '1200',
      status: AccountStatuses.active,
    };

    afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(businessAccountService.getBusinessAccount).to.be.a('function');
    });

    it('success- return business account', async () => {
      sinon.stub(bussinessAccountRepository, 'getBusinessAccountsByAccountIds').resolves([obj_output]);
      expect(await businessAccountService.getBusinessAccount('1')).to.deep.equal(obj_output);
    });

  });

  context('transferBusinessToBusiness', function () {
    const transfer_request: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 500
    };
    const transfer_request_2: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 15000
    };

    const transfer_request_3: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 1500
    };
    const source_account_model = {
      currency: 'EUR',
      company_id: '10000000',
      balance: 15000
    };
    const source_account_model_2 = {
      currency: 'EUR',
      company_id: '10000000',
      balance: 35000
    };
    const destination_account_model = {
      currency: 'EUR',
      company_id: '10000000',
      balance:5000
    };
    const destination_account_model_2 = {
      currency: 'USD',
      company_id: '10000001',
      balance:5000
    };

    const rate = 3.4;

  
    const transfer_response = {
      source_account: {},
      destination_account: {},
    };

    afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(businessAccountService.transferBusinessToBusiness).to.be.a('function');
    });

    it('success- transfer with same currency', async () => {
      sinon.stub(bussinessAccountRepository, 'getBusinessAccountsByAccountIds').resolves([source_account_model,destination_account_model] as IBusinessAccount[]);
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response as ITransferResponse);
      expect(await businessAccountService.transferBusinessToBusiness(transfer_request)).to.deep.equal(transfer_response);
    });

    it('success- transfer with diffrent currency', async () => {
      sinon.stub(bussinessAccountRepository, 'getBusinessAccountsByAccountIds').resolves([source_account_model,destination_account_model_2] as IBusinessAccount[]);
      sinon.stub(genericFunctions, 'getRate').resolves(rate);
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
      expect(await businessAccountService.transferBusinessToBusiness(transfer_request)).to.deep.equal({rate,...transfer_response});
    });

    it('failed- same company and amount over 10000', async () => {
      sinon.stub(bussinessAccountRepository, 'getBusinessAccountsByAccountIds').resolves([source_account_model_2,destination_account_model] as IBusinessAccount[]);
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response as ITransferResponse);
      try {
        await businessAccountService.transferBusinessToBusiness(transfer_request_3);
      } catch (error: any) {
        expect(error.message).to.be.equal(
          `Transfer Error : transaction between business accounts with same owning company is limited to ${businessAccountService.transaction_limit_businesses_same_company} coins`,
        );
      }
    });

    it('failed- diffrent company and amount over 1000', async () => {
      sinon.stub(bussinessAccountRepository, 'getBusinessAccountsByAccountIds').resolves([source_account_model,destination_account_model_2] as IBusinessAccount[]);
      sinon.stub(genericFunctions, 'getRate').resolves(3.4);
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response as ITransferResponse);
      try {
        await businessAccountService.transferBusinessToBusiness(transfer_request_3);
      } catch (error: any) {
        expect(error.message).to.be.equal(`Transfer Error : transaction between business accounts with diferrent owning companies is limited to ${businessAccountService.transaction_limit_businesses_different_company} coins`);
      }
    });
  });

  context('transferBusinessToIndividual', function () {
    const transfer_request: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 500,
    };
    const transfer_request_2: ITransferRequest = {
      source_account_id: '1',
      destination_account_id: '2',
      amount: 15000,
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
      expect(businessAccountService.transferBusinessToIndividual).to.be.a('function');
    });

    it('success- transfer sucess', async () => {
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
      expect(await businessAccountService.transferBusinessToIndividual(transfer_request)).to.deep.equal(transfer_response);
    });

    it('failed- transfer failed amount over 1000', async () => {
      sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
      try {
        await businessAccountService.transferBusinessToIndividual(transfer_request_2);
      } catch (error: any) {
        expect(error.message).to.be.equal(`Transfer Error : transaction from business account to individual account is limited to ${businessAccountService.transaction_limit_business_to_individual} coins`);
      }
    });

    it('failed- transfer failed ', async () => {
      sinon.stub(transferRepository, 'transfer').resolves(undefined);
      try {
        await businessAccountService.transferBusinessToIndividual(transfer_request);
      } catch (error: any) {
        expect(error.message).to.be.equal('Transfer Error:transfer failed');
      }
    });
  });
});
