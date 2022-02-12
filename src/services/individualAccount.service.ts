import { d } from '@ajar/marker';
import logicError from '../exceptions/logic.exception.js';
import transferError from '../exceptions/transfer.exception.js';
import familyAccountRepository from '../repositories/familyAccount.repository.js';
import individualAccountRepository from '../repositories/individualAccount.repository.js';
import transferRepository from '../repositories/transfer.repository.js';
import {
  IIndividualAccount,
  IndividualTransferDetails,
  ITransferRequest,
  ITransferResponse,
} from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';

class IndividualAccountService {
  async createIndividualAccount(
    payload: Omit<IIndividualAccount, 'accountID'>,
  ): Promise<IIndividualAccount> {
    const account_id: string = await individualAccountRepository.createIndividualAccount(payload);
    const individual_account = await this.getIndividualAccountByAccountId(account_id);
    return individual_account;
  }

  async getIndividualAccountByAccountId(account_id: string): Promise<IIndividualAccount> {
    const individual_account = await individualAccountRepository.getIndividualAccountByAccountId(
      account_id,
    );
    return individual_account;
  }

  async getIndividualAccountsByIndividualIds(
    individual_ids: string[],
  ): Promise<IIndividualAccount[]> {
    const individual_account =
      await individualAccountRepository.getIndividualAccountsByIndividualIds(individual_ids);
    return individual_account;
  }

  async getIndividualAccountsByAccountIds(account_ids: string[]): Promise<IIndividualAccount[]> {
    const individual_accounts = await individualAccountRepository.getIndividualAccountsByAccountIds(
      account_ids,
    );
    return individual_accounts;
  }

  async transferIndividualToFamily(payload: ITransferRequest): Promise<ITransferResponse> {
    const { source_account, destination_account } = payload;
    // const owners_id = await familyAccountRepository.getOwnersByAccountId(destination_account);
    // if(!owners_id.includes(source_account)) throw new transferError("the individual account didnt own family account")
    const transaction = await transferRepository.transfer(payload, 1);
    if (!transaction) {
      throw new logicError('transfer faild');
    }
    return transaction;
  }

  getIndividualAccountsRemainingBalance(
    individual_accounts: IIndividualAccount[],
    individual_accounts_details: IndividualTransferDetails[],
  ) {
    const individual_accounts_remaining_balance: IGeneralObj = individual_accounts.reduce(
      (obj, account) => {
        obj[account.account_id] = account.balance;
        return obj;
      },
      {} as IGeneralObj,
    );

    individual_accounts_details.forEach(account_details => {
      individual_accounts_remaining_balance[account_details[0]] =
        individual_accounts_remaining_balance[account_details[0]] - account_details[1];
    });

    return individual_accounts_remaining_balance;
  }
}

const individualAccountService = new IndividualAccountService();

export default individualAccountService;
