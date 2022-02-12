import {
  DetailsLevel,
  IFamilyAccount,
  IFamilyAccountCreationInput,
  IndividualTransferDetails,
  ITransferRequest,
  ITransferResponse,
} from '../types/account.types.js';
import  familyAccountRepository  from '../repositories/familyAccount.repository.js';
import TransferRepository from '../repositories/transfer.repository.js';
import transferError from '../exceptions/transfer.exception.js';
import HttpError from '../exceptions/http.exception.js';
import logicError from '../exceptions/logic.exception.js';
import accountRepository from '../repositories/account.repository.js';

export class FamilyAccountService {
  // async createFamilyAccount(
  //   payload: Omit<IFamilyAccountCreationInput, 'account_id'>,
  // ): Promise<IFamilyAccount> {
  //   const family_account_id = await familyAccountRepository.createFamilyAccount(payload);
  //   const family_account = await this.addIndividualAccountsToFamilyAccount(
  //     family_account_id,
  //     payload.individual_accounts_details,
  //   );
  //   if (!family_account) {
  //     throw new logicError('faild create family account');
  //   }
  //   return family_account;
  // }

  // async addIndividualAccountsToFamilyAccount(
  //   family_account_id: string,
  //   individual_accounts_details: IndividualTransferDetails[],
  //   details_level?: DetailsLevel,
  // ) {
  //   const individual_accounts_id = individual_accounts_details.map(
  //     (individual_accounts: IndividualTransferDetails) => individual_accounts[0],
  //   );
  //   const success: boolean = await familyAccountRepository.addIndividualAccountsToFamilyAccount(
  //     family_account_id,
  //     individual_accounts_id,
  //   );
  //   if (!success) throw new logicError('faild add individual accounts to family account');
  //   const account_id: string =
  //     await familyAccountRepository.transferFromIndividualAccountsToFamilyAccount(
  //       family_account_id,
  //       individual_accounts_details,
  //     );
  //   const family_account: IFamilyAccount = await this.getFamilyAccountByAccountIds(account_id, details_level);
  //   return family_account;
  // }

  // static async getFamilyAccountsByAccountIds(
  //   account_ids: string[],
  //   details_level?: DetailsLevel,
  // ): Promise<IFamilyAccount[]> {
  //   details_level = details_level || DetailsLevel.short;
  //   const family_accounts: IFamilyAccount[] =
  //     await familyAccountRepository.getFamilyAccountsByAccountIds(account_ids, details_level);
  //   if (!family_accounts) {
  //     throw new logicError('get familys account faild');
  //   }
  //   return family_accounts;
  // }

  // async transferFamilyToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
  //   if (payload.amount > 5000) {
  //     throw new transferError('transfer amount limit exceeded');
  //   }
  //   const transaction = await TransferRepository.transfer(payload, 1);
  //   if (!transaction) {
  //     throw new transferError('transfer faild');
  //   }
  //   return transaction;
  // }
  // static async removeIndividualAccountsFromFamilyAccount(
  //   family_account_id: string,
  //   individual_accounts_details: IndividualTransferDetails[],
  //   details_level?: DetailsLevel,
  // ) {
  //   const amount_to_remove = individual_accounts_details.reduce(
  //     (amount: number, individual_accounts: IndividualTransferDetails) =>
  //       amount + individual_accounts[1],
  //     0,
  //   );
  //   const account = await accountRepository.getAccountByAccountId(family_account_id);
  //   if (amount_to_remove > account.balance) {
  //     throw new transferError('balance in family account is not enough');
  //   }
  //   const owners_id: string[] = await familyAccountRepository.getOwnersByAccountId(account_id);
  //   const individual_accounts_id = individual_accounts_details.map(
  //     (individual_accounts: IndividualTransferDetails) => individual_accounts[0],
  //   );
  //   const remove_all = owners_id.every(own => {
  //     individual_accounts_id.includes(own);
  //   });
  //   if (account.balance - amount_to_remove < 5000 && !remove_all) {
  //     throw new transferError('cant leave active account with people under 5000t ');
  //   }

  //   const success: boolean = await familyAccountRepository.removeIndividualAccountsToFamilyAccount(
  //     family_account_id,
  //     individual_accounts_id,
  //   );
  //   if (!success) {
  //     throw new logicError('faild remove individual accounts to family account');
  //   }
  //   const account_id: string =
  //     await familyAccountRepository.transferFromFamilyAccountToIndividualAccounts(
  //       family_account_id,
  //       individual_accounts_details,
  //     );
  //   const family_account: IFamilyAccount = await this.getFamilyAccount(account_id, details_level);
  //   return family_account;
  // }

  // async closeFamilyAccount(account_id: string): Promise<boolean> {
  //   const owners_id: string[] = await familyAccountRepository.getOwnersByAccountId(account_id);
  //   if (owners_id) {
  //     throw new logicError('family account cant closed with people');
  //   }
  //   const status: string = await familyAccountRepository.closeFamilyAccount(account_id);
  //   if (status === 'not_active') return true;
  //   return false;
  // }
}

const familyAccountService = new FamilyAccountService();

export default familyAccountService;
