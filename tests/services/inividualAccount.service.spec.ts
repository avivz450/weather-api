// import { expect, assert } from 'chai';
// import sinon from 'sinon';
// import {
//   AccountStatuses,
//   IIndividualAccount,
//   ITransferRequest,
//   ITransferResponse,
// } from '../../src/types/account.types.js';
// import logicError from '../../src/exceptions/logic.exception.js';
// import genericFunctions from '../../src/utils/generic.functions.js';
// import transferRepository from '../../src/repositories/transfer.repository.js';
// import individualAccountRepository from '../../src/repositories/individualAccount.repository.js';
// import individualAccountService from '../../src/services/individualAccount.service.js';

// describe('#individual account service module', function () {
//   context('createIndividualAccount', function () {

//     const obj_input = {
//     };
//     const obj_output = {

//     };

//     this.afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(individualAccountService.createIndividualAccount).to.be.a('function');
//     });

//     it('success- return new individual account', async () => {
//       sinon.stub(individualAccountRepository, 'createIndividualAccount').resolves('1');
//       sinon.stub(individualAccountService, 'getIndividualAccountByAccountId').resolves(obj_output as IIndividualAccount);
//       expect(await individualAccountService.createIndividualAccount(obj_input as IIndividualAccount)).to.deep.equal(
//         obj_output,
//       );
//     });

//     it('faild- throw error create individual account', async () => {
//         sinon.stub(individualAccountRepository, 'createIndividualAccount').resolves('1');
//         sinon.stub(individualAccountService, 'getIndividualAccountByAccountId').resolves(undefined);
//       try {
//         individualAccountService.createIndividualAccount(obj_input as IIndividualAccount)
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Logic Error:create individual account faild');
//       }
//     });
//   });

//   context('getIndividualAccountByAccountId', function () {
//     const obj_output = {
//     };

//     afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(individualAccountRepository.getIndividualAccountByAccountId).to.be.a('function');
//     });

//     it('success- return business account', async () => {
//       sinon.stub(individualAccountRepository, 'getIndividualAccountByAccountId').resolves(obj_output as IIndividualAccount);
//       expect(await individualAccountService.getIndividualAccountByAccountId('1')).to.deep.equal(obj_output);
//     });

//     it('faild- throw error get business account', async () => {
//       sinon.stub(individualAccountRepository, 'getIndividualAccountByAccountId').resolves(undefined);
//       try {
//         await individualAccountService.getIndividualAccountByAccountId('1')
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Logic Error:get individual account faild');
//       }
//     });
//   });

// //   context('getIndividualAccountsByIndividualIds', function () {
// //     const transfer_request: ITransferRequest = {
// //       source_account: '1',
// //       destination_account: '2',
// //       amount: 500,
// //     };
// //     const transfer_request_2: ITransferRequest = {
// //       source_account: '1',
// //       destination_account: '2',
// //       amount: 15000,
// //     };
// //     const source_account_model = {
// //       currency: 'EUR',
// //       company_id: '10000000',
// //     };

// //     const destination_account_model = {
// //       currency: 'EUR',
// //       company_id: '10000000',
// //     };
// //     const destination_account_model_2 = {
// //       currency: 'USD',
// //       company_id: '10000001',
// //     };

// //     const transfer_response: ITransferResponse = {
// //       source_account: {},
// //       destination_account: {},
// //     };

// //     afterEach(() => {
// //       // Restore the default sandbox here
// //       sinon.restore();
// //     });

// //     it('should exists', () => {
// //       // @ts-ignore
// //       expect(businessAccountService.transferBusinessToBusiness).to.be.a('function');
// //     });

// //     it('success- transfer with same currency', async () => {
// //       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
// //       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
// //       getAccount.onCall(1).resolves(destination_account_model as IBusinessAccount);
// //       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
// //       expect(
// //         await businessAccountService.transferBusinessToBusiness(transfer_request),
// //       ).to.deep.equal(transfer_response);
// //     });

// //     it('success- transfer with diffrent currency', async () => {
// //       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
// //       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
// //       getAccount.onCall(1).resolves(destination_account_model_2 as IBusinessAccount);
// //       sinon.stub(genericFunctions, 'getRate').resolves(3.4);
// //       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
// //       expect(
// //         await businessAccountService.transferBusinessToBusiness(transfer_request),
// //       ).to.deep.equal(transfer_response);
// //     });

// //     it('faild- same company and amount over 10000', async () => {
// //       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
// //       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
// //       getAccount.onCall(1).resolves(destination_account_model as IBusinessAccount);
// //       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
// //       try {
// //         await businessAccountService.transferBusinessToBusiness(transfer_request_2);
// //       } catch (error: any) {
// //         expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
// //       }
// //     });

// //     it('faild- diffrent company and amount over 1000', async () => {
// //       const getAccount = sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID');
// //       getAccount.onCall(0).resolves(source_account_model as IBusinessAccount);
// //       getAccount.onCall(1).resolves(destination_account_model_2 as IBusinessAccount);
// //       sinon.stub(genericFunctions, 'getRate').resolves(3.4);
// //       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
// //       try {
// //         await businessAccountService.transferBusinessToBusiness(transfer_request_2);
// //       } catch (error: any) {
// //         expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
// //       }
// //     });
// //   });

// //   context('transferBusinessToIndividual', function () {
// //     const transfer_request: ITransferRequest = {
// //       source_account: '1',
// //       destination_account: '2',
// //       amount: 500,
// //     };
// //     const transfer_request_2: ITransferRequest = {
// //       source_account: '1',
// //       destination_account: '2',
// //       amount: 15000,
// //     };

// //     const transfer_response: ITransferResponse = {
// //       source_account: {},
// //       destination_account: {},
// //     };

// //     afterEach(() => {
// //       // Restore the default sandbox here
// //       sinon.restore();
// //     });

// //     it('should exists', () => {
// //       // @ts-ignore
// //       expect(businessAccountService.transferBusinessToIndividual).to.be.a('function');
// //     });

// //     it('success- transfer sucess', async () => {
// //       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
// //       expect(await businessAccountService.transferBusinessToIndividual(transfer_request)).to.deep.equal(transfer_response);
// //     });

// //     it('faild- transfer faild amount over 1000', async () => {
// //         sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
// //         try {
// //             await businessAccountService.transferBusinessToIndividual(transfer_request_2);
// //           } catch (error: any) {
// //             expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
// //           }      });

// //     it('faild- transfer faild ', async () => {
// //       sinon.stub(transferRepository, 'transfer').resolves(undefined);
// //       try {
// //         await businessAccountService.transferBusinessToIndividual(transfer_request);
// //       } catch (error: any) {
// //         expect(error.message).to.be.equal('Transfer Error:transfer faild');
// //       }
// //     });
// //   });
// });
