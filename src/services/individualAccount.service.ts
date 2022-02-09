import individualAccountRepository from '../repositories/individualAccount.repository.js';
import { IIndividualAccount, AccountDetails } from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';

class IndividualAccountService {
  async createIndividualAccount(
    payload: Omit<IIndividualAccount, 'accountID'>,
  ): Promise<IIndividualAccount> {
    const individual_account_id = await individualAccountRepository.createIndividualAccount(
      payload,
    );
    const individual_account = await individualAccountRepository.getIndividualAccountByAccountId(
      individual_account_id.toString(),
    );
    return individual_account;
  }

  async getIndividualAccountByAccountId(account_id: string): Promise<IIndividualAccount> {
    const individual_account = await individualAccountRepository.getIndividualAccountByAccountId(
      account_id,
    );
    return individual_account;
  }

  async getIndividualAccountByIndividualId(individual_id: string): Promise<IIndividualAccount> {
    const individual_account = await individualAccountRepository.getIndividualAccountByAccountId(
      individual_id,
    );
    return individual_account;
  }

  getIndividualAccountsRemainingBalance(individual_accounts: IIndividualAccount[], individual_accounts_details:AccountDetails[]){
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

  // async transferToFamily(accountID: string): Promise<IIndividualAccount> {
  //     const playlists = await playlistRepository.getAllPlaylists();
  //     return playlists;
  // }
}

const individualAccountService = new IndividualAccountService();

export default individualAccountService;
