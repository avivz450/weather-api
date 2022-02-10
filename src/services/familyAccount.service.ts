import { DetailsLevel, IFamilyAccount,IFamilyAccountCreationInput,IndividualTransferDetails,ITransferRequest,ITransferResponse} from "../types/account.types.js";
import { FamilyAccountRepository } from "../repositories/familyAccount.repository.js";
import { TransferRepository } from "../repositories/Transfer.Repository.js"
import  transferError  from "../exceptions/transfer.exception.js"
import HttpError from "../exceptions/http.exception.js";
import logicError from "../exceptions/logic.exception.js";

export class FamilyAccountService {

    async createFamilyAccount(payload: Omit<IFamilyAccountCreationInput, "account_id">):Promise<IFamilyAccount>{
        const family_account_id = await FamilyAccountRepository.createFamilyAccount(payload);
        const family_account =await this.addIndividualAccountsToFamilyAccount(family_account_id,payload.individual_accounts_details);
        return family_account;
    }

    async addIndividualAccountsToFamilyAccount(family_account_id:string,individual_accounts_details:IndividualTransferDetails[], details_level?:DetailsLevel){
        const individual_accounts_id = individual_accounts_details.map((individual_accounts:IndividualTransferDetails)=> individual_accounts[0]);
        const success:boolean = await FamilyAccountRepository.addIndividualAccountsToFamilyAccount(family_account_id,individual_accounts_id);
        if(!success) throw new logicError("faild add individual accounts to family account")
        const account_id:string = await FamilyAccountRepository.transferFromIndividualAccountsToFamilyAccount(family_account_id,individual_accounts_details);
        const family_account:IFamilyAccount = await this.getFamilyAccount(account_id,details_level);
        return family_account;
    }

    async getFamilyAccount(account_id: string,details_level?:DetailsLevel): Promise<IFamilyAccount> {
            details_level= details_level || DetailsLevel.short;
            const family_account:IFamilyAccount=  await FamilyAccountRepository.getFamilyAccountByAccountId(account_id,details_level);
            return family_account;
    }

    async getFamilyAccountsByAccountIds(account_ids : string[],details_level?:DetailsLevel) : Promise<IFamilyAccount[]>{
            details_level= details_level || DetailsLevel.short;
            const family_accounts:IFamilyAccount[]=  await FamilyAccountRepository.getFamilyAccountsByAccountIds(account_ids,details_level);
            return family_accounts;
    }

    async transferFamilyToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
        if(payload.amount > 5000) throw new transferError("transfer amount limit exceeded")
        const transaction = await TransferRepository.transfer(payload,1);
        if(!transaction) throw new transferError("transfer faild")
        return transaction;
    }
    
    async removeIndividualAccountsFromFamilyAccount(family_account_id:string,individual_accounts_details:IndividualTransferDetails[], details_level?:DetailsLevel){
        const individual_accounts_id = individual_accounts_details.map((individual_accounts:IndividualTransferDetails)=> individual_accounts[0]);
        const success:boolean = await FamilyAccountRepository.removeIndividualAccountsToFamilyAccount(family_account_id,individual_accounts_id);
        if(!success) throw new logicError("faild add individual accounts to family account")
        const account_id:string = await FamilyAccountRepository.transferFromFamilyAccountToIndividualAccounts(family_account_id,individual_accounts_details);
        const family_account:IFamilyAccount = await this.getFamilyAccount(account_id,details_level);
        return family_account;
    }

    async closeFamilyAccount(account_id:string): Promise<boolean> {
        const owners_id:string[]= await FamilyAccountRepository.getOwnersByAccountId(account_id);
        if(owners_id) throw new logicError("family account cant closed with people");
        const status:string = await FamilyAccountRepository.closeFamilyAccount(account_id);
        if(status === "not_active") return true;
        return false;
    }

}

const familyAccountService = new FamilyAccountService();

export default familyAccountService;
