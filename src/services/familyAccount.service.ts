import {
  AccountStatuses,
  AccountTypes,
  DetailsLevel,
  IFamilyAccount,
  IFamilyAccountCreationInput,
  IIndividualAccount,
  IndividualTransferDetails,
  ITransferRequest,
  ITransferResponse,
} from '../types/account.types.js';
import familyAccountRepository from '../repositories/familyAccount.repository.js';
import transferRepository from '../repositories/transfer.repository.js';
import TransferError from '../exceptions/transfer.exception.js';
import LogicError from '../exceptions/logic.exception.js';
import accountRepository from '../repositories/account.repository.js';
import accountValidationUtils from '../utils/account.validator.js';
import familyAccountValidator from '../modules/familyAccount.validation.js';
import genericFunctions from '../utils/generic.functions.js';
import { IGeneralObj } from '../types/general.types.js';

export class FamilyAccountService {
  private readonly _transaction_limit_business_to_individual = 5000;

  get transaction_limit_business_to_individual(): number {
    return this._transaction_limit_business_to_individual;
  }
  async createFamilyAccount(payload: Omit<IFamilyAccountCreationInput, 'account_id'>): Promise<IFamilyAccount> {
    const family_account_id = await familyAccountRepository.createFamilyAccount(payload);
    const family_account = await this.addIndividualAccountsToFamilyAccount(family_account_id, payload.individual_accounts_details, DetailsLevel.full);

    return family_account;
  }

  async getFamilyAccountById(family_account_id: string, details_level?: DetailsLevel): Promise<IFamilyAccount> {
    details_level = details_level || DetailsLevel.short;
    const [family_account] = (await familyAccountRepository.getFamilyAccountsByAccountIds([family_account_id], details_level)) as IFamilyAccount[];

    return family_account;
  }

  async transferFamilyToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
    if (payload.amount > this._transaction_limit_business_to_individual) {
      throw new TransferError(`transaction from family account to business account is limited to ${this._transaction_limit_business_to_individual} coins`);
    }
    const transaction = (await transferRepository.transfer(payload, 1)) as ITransferResponse;

    return transaction;
  }

  async addIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_details: IndividualTransferDetails[], details_level?: DetailsLevel): Promise<IFamilyAccount> {
    const individual_accounts_id = individual_accounts_details.map((individual_accounts: IndividualTransferDetails) => individual_accounts[0]);

    const owners_account = (await familyAccountRepository.getOwnersByFamilyAccountId(family_account_id)).map(owner=>String(owner));
    if(individual_accounts_id.some((account:string)=>owners_account.includes(account))){
      throw new LogicError("individual account id is already exist in family account")
    }

    await familyAccountRepository.addIndividualAccountsToFamilyAccount(family_account_id, individual_accounts_id);
    await familyAccountRepository.transferFromIndividualAccountsToFamilyAccount(family_account_id, individual_accounts_details);

    const family_account: IFamilyAccount = await this.getFamilyAccountById(family_account_id, details_level);

    return family_account;
  }

  async removeIndividualAccountsFromFamilyAccount(family_account_id: string, individual_accounts_details: IndividualTransferDetails[], details_level?: DetailsLevel): Promise<IFamilyAccount> {
    const amount_to_remove = individual_accounts_details.reduce((amount: number, individual_accounts: IndividualTransferDetails) => amount + Number(individual_accounts[1]), 0);
    const account = await this.getFamilyAccountById(family_account_id);
    const individual_accounts_id = individual_accounts_details.map((individual_accounts: IndividualTransferDetails) => individual_accounts[0]);
    const remove_all = account.owners.length === individual_accounts_details.length;

    if (!accountValidationUtils.isBalanceAllowsTransfer(account, amount_to_remove, AccountTypes.Family) && !remove_all) {
      throw new TransferError(`family account with connected individual accounts must remain with at least ${familyAccountValidator.minAmountOfBalance} coins`);
    } else if (amount_to_remove > account.balance) {
      throw new TransferError(`family account can't remain with negative amount of coins`);
    }

    await familyAccountRepository.removeIndividualAccountsFromFamilyAccount(family_account_id, individual_accounts_id);
    await familyAccountRepository.transferFromFamilyAccountToIndividualAccounts(family_account_id, individual_accounts_details);

    const family_account: IFamilyAccount = await this.getFamilyAccountById(family_account_id, details_level);

    return family_account;
  }

  async closeFamilyAccount(account_id: string): Promise<IGeneralObj> {
    const owners_id = await familyAccountRepository.getOwnersByFamilyAccountId(account_id);

    if (owners_id.length !== 0) {
      throw new LogicError(`family account can't be closed with individual accounts connected to it`);
    }
    await accountRepository.changeAccountsStatusesByAccountIds([account_id], AccountStatuses.inactive);

    return { status: 'success' } as IGeneralObj;
  }

  async sendRequestForTransferToIndividual(payload: ITransferRequest): Promise<string> {
    const family_account = await this.getFamilyAccountById(payload.source_account_id, DetailsLevel.full);
    let owners: Partial<IIndividualAccount>[] = [];
    (family_account.owners as IIndividualAccount[]).forEach((owner: IIndividualAccount) => {
      if (owner.account_id != payload.destination_account_id) {
        owners.push({ account_id: owner.account_id, email: owner.email });
      }
    });
    owners.forEach(owner => genericFunctions.sendTransferRequestEmail(owner, payload));
    return 'The transfer will only take place after one of the family members will approve it';
  }

  async confirmTransferFromFamily(source_account_id: string, destination_account_id: string, approver_account_id: string, amountTransfer: string): Promise<ITransferResponse> {
    const owners_id = await familyAccountRepository.getOwnersByFamilyAccountId(source_account_id);

    if (!owners_id.some(item => item == approver_account_id)) {
      throw new LogicError("You arn't authorized to submit that transfer");
    }
    const payload: ITransferRequest = {
      source_account_id: source_account_id,
      destination_account_id: destination_account_id,
      amount: parseInt(amountTransfer),
    };

    const transaction = (await transferRepository.transfer(payload, 1)) as ITransferResponse;
    if (!transaction) {
      throw new TransferError('transfer failed');
    }
    return transaction;
  }
}

const familyAccountService = new FamilyAccountService();
export default familyAccountService;
