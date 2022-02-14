import { IBusinessAccount, ITransferRequest, ITransferResponse } from '../types/account.types.js';
import bussinessAccountRepository from '../repositories/bussinessAccount.repository.js';
import TransferRepository from '../repositories/transfer.repository.js';
import transferError from '../exceptions/transfer.exception.js';
import logicError from '../exceptions/logic.exception.js';
import  genericFunctions from '../utils/generic.functions.js';
export class BusinessAccountService {

   async createBusinessAccount(payload: Omit<IBusinessAccount, 'account_id'>): Promise<IBusinessAccount> {
    const account_id: string = await bussinessAccountRepository.createBusinessAccount(payload);
    const business_account = await this.getBusinessAccount(account_id);
    return business_account;
  }

   async getBusinessAccount(account_id: string): Promise<IBusinessAccount> {
    const businessAccount: IBusinessAccount =await bussinessAccountRepository.getBusinessAccountByAccountID(account_id);
    if (!businessAccount) throw new logicError('faild get bussines account');
    return businessAccount;
  }

  async transferBusinessToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
    let rate = 1;
    const { source_account_id, destination_account_id, amount } = payload;

    const source_account_model = await bussinessAccountRepository.getBusinessAccountByAccountID(source_account_id);
    const destination_account_model =await bussinessAccountRepository.getBusinessAccountByAccountID(destination_account_id);

    const same_company = source_account_model.company_id === destination_account_model.company_id;
    if (same_company && amount > 10000) {
      throw new transferError('transfer amount limit exceeded');
    }
    if (!same_company && amount > 1000) {
      throw new transferError('transfer amount limit exceeded');
    }
    const source_currency = source_account_model.currency;
    const destination_currency = destination_account_model.currency;

    if (source_currency !== destination_currency) {
      rate = await genericFunctions.getRate(source_currency,destination_currency)
    }

    const transaction = await TransferRepository.transfer(payload, rate);

    if (!transaction) {
      throw new transferError('transfer faild');
    }
    return transaction;
  }

  async transferBusinessToIndividual(payload: ITransferRequest): Promise<ITransferResponse> {
    if (payload.amount > 1000) {
      throw new transferError('transfer amount limit exceeded');
    }
    const transaction = await TransferRepository.transfer(payload, 1);
    if (!transaction) {
      throw new transferError('transfer faild');
    }
    return transaction;
  }
}

const businessAccountService = new BusinessAccountService();

export default businessAccountService;
