import { IBusinessAccount, ITransferRequest, ITransferResponse } from "../types/account.types.js";
import businessRepository from "../repositories/bussinessAccount.repository.js"

class BusinessAccountService {

    async createBusinessAccount(payload: Omit<IBusinessAccount, "accountID">){
        const businessAccount = await businessRepository.createBusinessAccount(payload);
        return businessAccount;
    }

//     async getBusinessAccount(accountID: string): Promise<IBusinessAccount> {
//         // const businessAccount = await businessRepository.getBusinessAccountByAccountID();
//         // return businessAccount;
//     }

//     async transferToBusinessAccountSameCurrency(payload: ITransferRequest): Promise<ITransferResponse> {
//         const transaction = await businessRepository.transferToBusinessAccountSameCurrency(payload);
//         return transaction;
//     }

//     async transferToBusinessAccountDifferentCurrency(payload: ITransferRequest): Promise<ITransferResponse> {
//         // EXCHANGE CURRENCY WITH API
//         // const transaction = await businessRepository.transferToBusinessAccountDifferentCurrency(payload);
//         // return transaction;
//     }

//     async transferToIndividualAccount(payload: ITransferRequest): Promise<ITransferResponse> {
//         // const transaction = await businessRepository.transferToBusinessAccountDifferentCurrency(payload);
//         // return transaction;
//     }
}

const businessAccountService = new BusinessAccountService();

export default businessAccountService;
