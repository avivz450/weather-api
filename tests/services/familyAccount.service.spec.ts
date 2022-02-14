import { expect, assert } from 'chai';
import sinon from 'sinon';
import {
  AccountStatuses,
    IFamilyAccount,
    IFamilyAccountCreationInput,
  IIndividualAccount,
  ITransferRequest,
  ITransferResponse,
} from '../../src/types/account.types.js';
import logicError from '../../src/exceptions/logic.exception.js';
import genericFunctions from '../../src/utils/generic.functions.js';
import transferRepository from '../../src/repositories/transfer.repository.js';
import familyAccountRepository from '../../src/repositories/familyAccount.repository.js';
import familyAccountService, { FamilyAccountService } from '../../src/services/familyAccount.service.js';
import accountRepository from '../../src/repositories/account.repository.js';

describe('#family account service module', function () {
  context('createFamilyAccount', function () {

    const obj_input = {
    };
    const obj_output = {
    };

    this.afterEach(() => {
      // Restore the default sandbox here
      sinon.restore();
    });

    it('should exists', () => {
      // @ts-ignore
      expect(familyAccountService.createFamilyAccount).to.be.a('function');
    });

    // it('success- return new family account', async () => {
    //   sinon.stub(familyAccountRepository, 'createFamilyAccount').resolves('1');
    //   sinon.stub(familyAccountService, 'addIndividualAccountsToFamilyAccount').resolves(obj_output as IFamilyAccount);
    //   expect(await familyAccountRepository.createFamilyAccount(obj_input as IFamilyAccountCreationInput)).to.deep.equal(obj_output);
    // });

    // it('faild- throw error create individual account', async () => {
    //   sinon.stub(familyAccountRepository, 'createFamilyAccount').resolves(undefined);
    //   sinon.stub(familyAccountService, 'addIndividualAccountsToFamilyAccount').resolves(obj_output as IFamilyAccount);
    //   expect(await familyAccountRepository.createFamilyAccount(obj_input as IFamilyAccountCreationInput)).to.deep.equal(obj_output);
    //   try {
    //     familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput)
    //   } catch (error: any) {
    //     expect(error.message).to.be.equal('Logic Error:create family account faild');
    //   }
    // });
  });

//   context('removeIndividualAccountsFromFamilyAccount', function () {

//     const account = {
//         balance:400
//     };

//     const individual_accounts_details = [["2",300]];

//     afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(familyAccountService.removeIndividualAccountsFromFamilyAccount).to.be.a('function');
//     });

//     it('success- remove all individual', async () => {
//       sinon.stub(accountRepository, 'getAccountByAccountId').resolves(obj_output as IIndividualAccount);
//       expect(await familyAccountService.getIndividualAccountByAccountId('1')).to.deep.equal(obj_output);
//     });

//     it('faild- amount to remove bigger then the balance in the family account', async () => {
//       sinon.stub(individualAccountRepository, 'getIndividualAccountByAccountId').resolves(undefined);
//       try {
//         await individualAccountService.getIndividualAccountByAccountId('1')
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Logic Error:get individual account faild');
//       }
//     });

//     it('faild- cant leave active account with people under 5000t', async () => {

//     it('faild - remove individual accounts to family account', async () => {

//   });

//   context('getIndividualAccountsByIndividualIds', function () {
//     const transfer_request: ITransferRequest = {
//       source_account: '1',
//       destination_account: '2',
//       amount: 500,
//     };
//     const transfer_request_2: ITransferRequest = {
//       source_account: '1',
//       destination_account: '2',
//       amount: 15000,
//     };
//     const source_account_model = {
//       currency: 'EUR',
//       company_id: '10000000',
//     };

//     const destination_account_model = {
//       currency: 'EUR',
//       company_id: '10000000',
//     };
//     const destination_account_model_2 = {
//       currency: 'USD',
//       company_id: '10000001',
//     };

//     const transfer_response: ITransferResponse = {
//       source_account: {},
//       destination_account: {},
//     };

//     afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(businessAccountService.transferBusinessToBusiness).to.be.a('function');
//     });

//     it('success- transfer with same currency', async () => {
//       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
//       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
//       getAccount.onCall(1).resolves(destination_account_model as IBusinessAccount);
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       expect(
//         await businessAccountService.transferBusinessToBusiness(transfer_request),
//       ).to.deep.equal(transfer_response);
//     });

//     it('success- transfer with diffrent currency', async () => {
//       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
//       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
//       getAccount.onCall(1).resolves(destination_account_model_2 as IBusinessAccount);
//       sinon.stub(genericFunctions, 'getRate').resolves(3.4);
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       expect(
//         await businessAccountService.transferBusinessToBusiness(transfer_request),
//       ).to.deep.equal(transfer_response);
//     });

//     it('faild- same company and amount over 10000', async () => {
//       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
//       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
//       getAccount.onCall(1).resolves(destination_account_model as IBusinessAccount);
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       try {
//         await businessAccountService.transferBusinessToBusiness(transfer_request_2);
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
//       }
//     });

//     it('faild- diffrent company and amount over 1000', async () => {
//       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
//       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
//       getAccount.onCall(1).resolves(destination_account_model_2 as IBusinessAccount);
//       sinon.stub(genericFunctions, 'getRate').resolves(3.4);
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       try {
//         await businessAccountService.transferBusinessToBusiness(transfer_request_2);
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
//       }
//     });
//   });

//   context('transferBusinessToIndividual', function () {
//     const transfer_request: ITransferRequest = {
//       source_account: '1',
//       destination_account: '2',
//       amount: 500,
//     };
//     const transfer_request_2: ITransferRequest = {
//       source_account: '1',
//       destination_account: '2',
//       amount: 15000,
//     };

//     const transfer_response: ITransferResponse = {
//       source_account: {},
//       destination_account: {},
//     };

//     afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(businessAccountService.transferBusinessToIndividual).to.be.a('function');
//     });

//     it('success- transfer sucess', async () => {
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       expect(await businessAccountService.transferBusinessToIndividual(transfer_request)).to.deep.equal(transfer_response);
//     });

//     it('faild- transfer faild amount over 1000', async () => {
//         sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//         try {
//             await businessAccountService.transferBusinessToIndividual(transfer_request_2);
//           } catch (error: any) {
//             expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
//           }      });

//     it('faild- transfer faild ', async () => {
//       sinon.stub(transferRepository, 'transfer').resolves(undefined);
//       try {
//         await businessAccountService.transferBusinessToIndividual(transfer_request);
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Transfer Error:transfer faild');
//       }
//     });
//   });
});
