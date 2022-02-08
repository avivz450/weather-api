import {
  IBusinessAccount,
  // ITransferRequest,
  // ITransferResponse,
} from '../types/account.types.js';
import { BussinessAccountRepository } from '../repositories/bussinessAccount.repository.js';

export class BusinessAccountService {
  static async createBusinessAccount(payload: Omit<IBusinessAccount, 'accountID'>) {
    const businessAccount = await BussinessAccountRepository.createBusinessAccount(payload);
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
