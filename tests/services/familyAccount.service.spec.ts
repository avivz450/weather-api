// import { expect, assert } from 'chai';
// import sinon from 'sinon';
// import {
//   AccountStatuses,
//     IAccount,
//     IFamilyAccount,
//     IFamilyAccountCreationInput,
//   IIndividualAccount,
//   IndividualTransferDetails,
//   ITransferRequest,
//   ITransferResponse,
// } from '../../src/types/account.types.js';
// import logicError from '../../src/exceptions/logic.exception.js';
// import genericFunctions from '../../src/utils/generic.functions.js';
// import transferRepository from '../../src/repositories/transfer.repository.js';
// import familyAccountRepository from '../../src/repositories/familyAccount.repository.js';
// import familyAccountService, { FamilyAccountService } from '../../src/services/familyAccount.service.js';
// import accountRepository from '../../src/repositories/account.repository.js';

// describe('#family account service module', function () {
//   context('createFamilyAccount', function () {

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
//       expect(familyAccountService.createFamilyAccount).to.be.a('function');
//     });

//     it('success- return new family account', async () => {
//       sinon.stub(familyAccountRepository, 'createFamilyAccount').resolves('1');
//       sinon.stub(familyAccountService, 'addIndividualAccountsToFamilyAccount').resolves(obj_output as IFamilyAccount);
//       expect(await familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput)).to.deep.equal(obj_output);
//     });

//     // it('faild- throw error create individual account', async () => {
//     //   sinon.stub(familyAccountRepository, 'createFamilyAccount').resolves(undefined);
//     //   sinon.stub(familyAccountService, 'addIndividualAccountsToFamilyAccount').resolves(obj_output as IFamilyAccount);
//     //   expect(await familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput)).to.deep.equal(obj_output);
//     //   try {
//     //     familyAccountService.createFamilyAccount(obj_input as IFamilyAccountCreationInput)
//     //   } catch (error: any) {
//     //     expect(error.message).to.be.equal('Logic Error:create family account faild');
//     //   }
//     // });
//   });

//   context('removeIndividualAccountsFromFamilyAccount', function () {

//     const account = {
//         balance:6000
//     };
//     const account_2 = {
//         balance:1000
//     };
//     const owners_id = ["2","7"];
//     const family_account={};
//     const individual_accounts_details:IndividualTransferDetails[] = [["2",300],["7",400]];

//     afterEach(() => {
//       // Restore the default sandbox here
//       sinon.restore();
//     });

//     it('should exists', () => {
//       // @ts-ignore
//       expect(familyAccountService.removeIndividualAccountsFromFamilyAccount).to.be.a('function');
//     });

//     it('success- remove all individual', async () => {
//       sinon.stub(accountRepository, 'getAccountByAccountId').resolves(account as IAccount);
//       sinon.stub(familyAccountRepository, 'getOwnersByFamilyAccountId').resolves(owners_id);
//       sinon.stub(familyAccountRepository, 'removeIndividualAccountsFromFamilyAccount').resolves(true);
//       sinon.stub(familyAccountRepository, 'transferFromFamilyAccountToIndividualAccounts').resolves(true);
//       sinon.stub(familyAccountService, 'getFamilyAccountById').resolves(family_account as IFamilyAccount);
//       expect(await familyAccountService.removeIndividualAccountsFromFamilyAccount('1',individual_accounts_details)).to.deep.equal(family_account);
//     });

//     // it('faild- amount to remove bigger then the balance in the family account', async () => {
//     //   sinon.stub(individualAccountRepository, 'getIndividualAccountByAccountId').resolves(undefined);
//     //   try {
//     //     await individualAccountService.getIndividualAccountByAccountId('1')
//     //   } catch (error: any) {
//     //     expect(error.message).to.be.equal('Logic Error:get individual account faild');
//     //   }
//     // });

//     // it('faild- cant leave active account with people under 5000t', async () => {

//     // it('faild - remove individual accounts to family account', async () => {

//   });

//   context('transferFamilyToBusiness', function () {
//     const transfer_request: ITransferRequest = {
//       source_account_id: '1',
//       destination_account_id: '2',
//       amount: 500,
//     };
//     const transfer_request_2: ITransferRequest = {
//       source_account_id: '1',
//       destination_account_id: '2',
//       amount: 6000,
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
//       expect(familyAccountService.transferFamilyToBusiness).to.be.a('function');
//     });

//     it('success- transfer success', async () => {
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       expect(await familyAccountService.transferFamilyToBusiness(transfer_request)).to.deep.equal(transfer_response);
//     });

//     it('faild- amount over 5000', async () => {
//       sinon.stub(transferRepository, 'transfer').resolves(transfer_response);
//       try {
//         await familyAccountService.transferFamilyToBusiness(transfer_request_2);
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Transfer Error:transfer amount limit exceeded');
//       }
//     });

//     it('faild- transfer failed', async () => {
//       sinon.stub(transferRepository, 'transfer').resolves(undefined);
//       try {
//         await familyAccountService.transferFamilyToBusiness(transfer_request);
//       } catch (error: any) {
//         expect(error.message).to.be.equal('Transfer Error:transfer failed');
//       }
//     });
//   });

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
