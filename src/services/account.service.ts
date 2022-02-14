import accountRepository from '../repositories/account.repository.js';
import { AccountStatuses, IAccount, IIndividualAccount } from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';

class AccountService {
  async changeStatusAccountsByAccountIds(new_status: string, accounts_ids: string[]) {
    const status = await accountRepository.changeAccountsStatusesByAccountIds(accounts_ids, new_status as AccountStatuses);
    const result_accounts = accounts_ids.map((account_id: string) => {
      return {
        account_id,
        status,
      };
    });
    return result_accounts;
  }
}

const accountService = new AccountService();
export default accountService;
