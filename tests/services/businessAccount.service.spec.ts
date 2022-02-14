// import { expect, assert } from 'chai';
// import sinon from 'sinon';
// import businessAccountService from '../../src/services/businessAccount.service.js';
// import bussinessAccountRepository from '../../src/repositories/bussinessAccount.repository.js';
// import {
//   AccountStatuses,
//   IBusinessAccount,
//   ITransferRequest,
//   ITransferResponse,
// } from '../../src/types/account.types.js';
// import logicError from '../../src/exceptions/logic.exception.js';
// import genericFunctions from '../../src/utils/generic.functions.js';
// import transferRepository from '../../src/repositories/transfer.repository.js';

// describe('#business account service module', function () {
//   context('createBusinessAccount', function () {
//     const obj_input: Omit<IBusinessAccount, 'account_id'> = {
//       company_id: '10000000',
//       company_name: 'Rapyd',
//       currency: 'EUR',
//       balance: 5000,
//       agent_id: '1200',
//       status: undefined,
//     };
//     const obj_output: IBusinessAccount = {
//       account_id: '1',
//       company_id: '10000000',
//       company_name: 'Rapyd',
//       currency: 'EUR',
//       balance: 5000,
//       agent_id: '1200',
//       status: AccountStatuses.active,
//     };

//     this.afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(businessAccountService.createBusinessAccount).to.be.a('function');
//     });

//     it('success- return new business account', async () => {
//       sinon.stub(bussinessAccountRepository, 'createBusinessAccount').resolves('1');
//       sinon.stub(businessAccountService, 'getBusinessAccount').resolves(obj_output);
//       expect(await businessAccountService.createBusinessAccount(obj_input)).to.deep.equal(
//         obj_output,
//       );
//     });

//     it('faild- throw error create business account', async () => {
//       sinon.stub(bussinessAccountRepository, 'createBusinessAccount').resolves('1');
//       sinon.stub(businessAccountService, 'getBusinessAccount').resolves(undefined);
//       try {
//         await businessAccountService.createBusinessAccount(obj_input);
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Logic Error:create business account faild');
//       }
//     });
//   });

//   context('getBusinessAccount', function () {
//     const obj_output = {
//       account_id: '1',
//       company_id: '10000000',
//       company_name: 'Rapyd',
//       currency: 'EUR',
//       balance: 5000,
//       agent_id: '1200',
//       status: AccountStatuses.active,
//     };

//     afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(businessAccountService.getBusinessAccount).to.be.a('function');
//     });

//     it('success- return business account', async () => {
//       sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID').resolves(obj_output);
//       expect(await businessAccountService.getBusinessAccount('1')).to.deep.equal(obj_output);
//     });

//     it('faild- throw error get business account', async () => {
//       sinon.stub(bussinessAccountRepository, 'getBusinessAccountByAccountID').resolves(undefined);
//       try {
//         await businessAccountService.getBusinessAccount('1');
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Logic Error:faild get bussines account');
//       }
//     });
//   });

//   context('transferBusinessToBusiness', function () {
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
// });
