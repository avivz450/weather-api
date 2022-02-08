import individualAccountRepository from '../repositories/individualAccount.repository.js';
import { IIndividualAccount } from '../types/account.types.js';

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

  // async transferToFamily(accountID: string): Promise<IIndividualAccount> {
  //     const playlists = await playlistRepository.getAllPlaylists();
  //     return playlists;
  // }
}

const individualAccountService = new IndividualAccountService();

export default individualAccountService;
