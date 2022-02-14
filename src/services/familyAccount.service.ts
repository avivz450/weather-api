import { AccountStatuses, DetailsLevel, IFamilyAccount, IFamilyAccountCreationInput, IndividualTransferDetails, ITransferRequest, ITransferResponse } from '../types/account.types.js';
import familyAccountRepository from '../repositories/familyAccount.repository.js';
import transferRepository from '../repositories/transfer.repository.js';
import transferError from '../exceptions/transfer.exception.js';
import HttpError from '../exceptions/http.exception.js';
import logicError from '../exceptions/logic.exception.js';
import accountRepository from '../repositories/account.repository.js';

export class FamilyAccountService {
  async createFamilyAccount(payload: Omit<IFamilyAccountCreationInput, 'account_id'>): Promise<IFamilyAccount> {
    const family_account_id = await familyAccountRepository.createFamilyAccount(payload);
    // const individual_ids_to_connect = payload.individual_accounts_details.map(tuple => tuple[0]);
    const family_account = await this.addIndividualAccountsToFamilyAccount(family_account_id, payload.individual_accounts_details, DetailsLevel.full);
    return family_account;
  }

  async getFamilyAccountById(family_account_id: string, details_level?: DetailsLevel): Promise<IFamilyAccount> {
    details_level = details_level || DetailsLevel.short;

    const family_account: IFamilyAccount | undefined = await familyAccountRepository.getFamilyAccountById(family_account_id, details_level);

    if (!family_account) {
      throw new logicError('get familys account faild');
    }
    return family_account;
  }

  async transferFamilyToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
    if (payload.amount > 5000) {
      throw new transferError('transfer amount limit exceeded');
    }
    const transaction = await transferRepository.transfer(payload, 1);
    if (!transaction) {
      throw new transferError('transfer failed');
    }
    return transaction;
  }

  async addIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_details: IndividualTransferDetails[], details_level?: DetailsLevel) {
    const individual_accounts_id = individual_accounts_details.map((individual_accounts: IndividualTransferDetails) => individual_accounts[0]);

    let success: boolean = await familyAccountRepository.addIndividualAccountsToFamilyAccount(family_account_id, individual_accounts_id);
    if (!success) throw new logicError('faild add individual accounts to family account');

    success = await familyAccountRepository.transferFromIndividualAccountsToFamilyAccount(family_account_id, individual_accounts_details);
    if (!success) throw new logicError('faild to transfer from individual accounts to familt account');

    const family_account: IFamilyAccount = await this.getFamilyAccountById(family_account_id, details_level);
    return family_account;
  }

  async removeIndividualAccountsFromFamilyAccount(family_account_id: string, individual_accounts_details: IndividualTransferDetails[], details_level?: DetailsLevel) {
    const amount_to_remove = individual_accounts_details.reduce((amount: number, individual_accounts: IndividualTransferDetails) => amount + individual_accounts[1], 0);
    const account = await accountRepository.getAccountByAccountId(family_account_id);
 
    if (amount_to_remove > account.balance) {
      throw new transferError('balance in family account is not enough');
    }

    const owners_id = await familyAccountRepository.getOwnersByFamilyAccountId(family_account_id);
    const individual_accounts_id = individual_accounts_details.map((individual_accounts: IndividualTransferDetails) => individual_accounts[0]);
    const remove_all = individual_accounts_id.sort().join(',') == owners_id.sort().join(',');

    if (account.balance - amount_to_remove < 5000 && !remove_all) {
      throw new transferError('cant leave active account with people under 5000t ');
    }

    const removal: boolean = await familyAccountRepository.removeIndividualAccountsFromFamilyAccount(family_account_id, individual_accounts_id);
    if (!removal) {
      throw new logicError('faild remove individual accounts to family account');
    }

    const transfer = await familyAccountRepository.transferFromFamilyAccountToIndividualAccounts(family_account_id, individual_accounts_details);
    if (!transfer) {
      throw new logicError('Failed to transfer from family account to individual accounts');
    }

    const family_account: IFamilyAccount = await this.getFamilyAccountById(family_account_id, details_level);
    return family_account;
  }

  async closeFamilyAccount(account_id: string) {
    const owners_id = await familyAccountRepository.getOwnersByFamilyAccountId(account_id);

    if (owners_id.length !== 0) {
      throw new logicError(`family account can't be closed with individual accounts connected to it`);
    }
    await accountRepository.changeAccountsStatusesByAccountIds([account_id], AccountStatuses.inactive);

    return true;
  }
}

const familyAccountService = new FamilyAccountService();
export default familyAccountService;
