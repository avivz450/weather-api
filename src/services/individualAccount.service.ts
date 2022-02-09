import individualAccountRepository from '../repositories/individualAccount.repository.js';
import { IIndividualAccount } from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';

class IndividualAccountService {
  async createIndividualAccount(payload: Omit<IIndividualAccount, "accountID">): Promise<IIndividualAccount> {
        const individual_account =await individualAccountRepository.createIndividualAccount(payload);
        return individual_account;
    }

    async getIndividualAccountByAccountId(account_id: string): Promise<IIndividualAccount> {
        const individual_account = await individualAccountRepository.getIndividualAccountByAccountId(account_id);
        return individual_account;
    }

    async getIndividualAccountsByIndividualIds(individual_ids: string[]): Promise<IIndividualAccount[]> {
        const individual_account = await individualAccountRepository.getIndividualAccountsByIndividualIds(individual_ids);
        return individual_account;
    }
    async getIndividualAccountsByAccountIds(account_ids : string[]) : Promise<IIndividualAccount[]>{
        const individual_accounts =await individualAccountRepository.getIndividualAccountsByAccountIds(account_ids);
        return individual_accounts;
    }

    async transferIndividualToFamily(payload: ITransferRequest): Promise<IIndividualAccount> {
        const playlists = await individualAccountRepository.transferBusinessToIndividual(payload);
        return playlists;
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
}

const individualAccountService = new IndividualAccountService();

export default individualAccountService;
