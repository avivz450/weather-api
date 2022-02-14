import { expect, assert } from 'chai';
import sinon from 'sinon';
import {
  AccountStatuses,
  IIndividualAccount,
  ITransferRequest,
  ITransferResponse,
} from '../../src/types/account.types.js';
import logicError from '../../src/exceptions/logic.exception.js';
import genericFunctions from '../../src/utils/generic.functions.js';
import transferRepository from '../../src/repositories/transfer.repository.js';
import individualAccountRepository from '../../src/repositories/individualAccount.repository.js';
import individualAccountService from '../../src/services/individualAccount.service.js';

describe('#individual account service module', function () {
  context('createIndividualAccount', function () {

    const obj_input = {};
    const obj_output = [{}];

    this.afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(individualAccountService.createIndividualAccount).to.be.a('function');
    });

    it('success- return new individual account', async () => {
      sinon.stub(individualAccountRepository, 'createIndividualAccount').resolves('1');
      sinon.stub(individualAccountService, 'getIndividualAccountsByAccountIds').resolves(obj_output as IIndividualAccount[]);
      expect(await individualAccountService.createIndividualAccount(obj_input as IIndividualAccount)).to.deep.equal({});
    });

    it('failed- throw error create individual account', async () => {
        sinon.stub(individualAccountRepository, 'createIndividualAccount').resolves('1');
        sinon.stub(individualAccountService, 'getIndividualAccountsByAccountIds').resolves(undefined);
      try {
        individualAccountService.createIndividualAccount(obj_input as IIndividualAccount)
      } catch (error: any) {
        expect(error.message).to.be.equal('Logic Error:create individual account failed');
      }
    });
  });

  // context('getIndividualAccountByAccountId', function () {
  //   const obj_output = {
  //   };

  //   afterEach(() => {
  //     // Restore the default sandbox here
  //     sinon.restore();
  //   });

  //   it('should exists', () => {
  //     // @ts-ignore
  //     expect(individualAccountRepository.getIndividualAccountByAccountId).to.be.a('function');
  //   });

  //   it('success- return business account', async () => {
  //     sinon.stub(individualAccountRepository, 'getIndividualAccountByAccountId').resolves(obj_output as IIndividualAccount);
  //     expect(await individualAccountService.getIndividualAccountByAccountId('1')).to.deep.equal(obj_output);
  //   });

  //   it('failed- throw error get business account', async () => {
  //     sinon.stub(individualAccountRepository, 'getIndividualAccountByAccountId').resolves(undefined);
  //     try {
  //       await individualAccountService.getIndividualAccountByAccountId('1')
  //     } catch (error: any) {
  //       expect(error.message).to.be.equal('Logic Error:get individual account failed');
  //     }
  //   });
  // });
});
