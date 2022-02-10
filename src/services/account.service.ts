import AccountRepository from '../repositories/Account.repository.js';
import { IAccount, IIndividualAccount } from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';

export class AccountService {
  static async changeStatusAccountsByAccountIds(action:string,account_ids:string[]){
    const status = await AccountRepository.changeStatusAccountsByAccountIds(action,account_ids);
    const result_accounts = account_ids.map((account_id:string)=> [account_id,status])
    return result_accounts ;
  }
}

const accountService = new AccountService();
export default accountService;
