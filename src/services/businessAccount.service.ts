import { IBusinessAccount,ITransferRequest,ITransferResponse} from "../types/account.types.js";
import { BussinessAccountRepository } from "../repositories/bussinessAccount.repository.js";
import  transferError  from "../exceptions/transfer.exeception.js"
export class BusinessAccountService {
    static async createBusinessAccount(
        payload: Omit<IBusinessAccount, "accountID">
    ):Promise<IBusinessAccount>{
        const businessAccount = await BussinessAccountRepository.createBusinessAccount(payload);
        return businessAccount;
    }

    static async getBusinessAccount(account_id: string): Promise<IBusinessAccount> {
            const businessAccount:IBusinessAccount= await BussinessAccountRepository.getBusinessAccountByAccountId(account_id);
            return businessAccount;
        }

    static async transferBusinessToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
        let rate =1;
        const {source_account,destination_account,amount} = payload;

        const source_account_model = await BussinessAccountRepository.getBusinessAccountByAccountId(source_account);
        const destination_account_model = await BussinessAccountRepository.getBusinessAccountByAccountId(destination_account);

        const same_company = source_account_model.company_id === destination_account_model.company_id;
        if(same_company && amount > 10000) throw new transferError("transfer amount limit exceeded");
        if(!same_company && amount > 1000) throw new transferError("transfer amount limit exceeded");

        const source_currency = source_account_model.currency;
        const destination_currency = source_account_model.currency;

        if(source_currency!==destination_currency){
          const base_url = `http://api.exchangeratesapi.io/latest`;
          const url = `${base_url}?base=${source_currency}&symbols=${destination_currency}&access_key=78ca52413fb26cdc4a99ec638fa21db7`;
          const response = await(await fetch(url)).json();
          rate = response.rates[destination_currency];
        }
        const transaction = await BussinessAccountRepository.transferBusinessToBusiness(payload,rate);  
        return transaction;
    }

    static async transferBusinessToIndividual(payload: ITransferRequest): Promise<ITransferResponse> {
        if(payload.amount > 1000) throw new transferError("transfer amount limit exceeded");
        const transaction = await BussinessAccountRepository.transferBusinessToIndividual(payload);
        return transaction;
    }

}

const businessAccountService = new BusinessAccountService();

export default businessAccountService;
