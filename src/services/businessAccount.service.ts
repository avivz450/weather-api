import { IBusinessAccount, ITransferRequest, ITransferResponse } from '../types/account.types.js';
import bussinessAccountRepository from '../repositories/bussinessAccount.repository.js';
import TransferRepository from '../repositories/transfer.repository.js';
import TransferError from '../exceptions/transfer.exception.js';
import logicError from '../exceptions/logic.exception.js';
import genericFunctions from '../utils/generic.functions.js';
class BusinessAccountService {
  private readonly transaction_limit_businesses_same_company = 10000;
  private readonly transaction_limit_businesses_different_company = 1000;
  private readonly transaction_limit_business_to_individual = 1000;

  async createBusinessAccount(payload: Omit<IBusinessAccount, 'account_id'>): Promise<IBusinessAccount> {
    const account_id: string = await bussinessAccountRepository.createBusinessAccount(payload);
    const business_account = await this.getBusinessAccount(account_id);

    return business_account;
  }

  async getBusinessAccount(account_id: string): Promise<IBusinessAccount> {
    const businessAccount: IBusinessAccount = await bussinessAccountRepository.getBusinessAccountByAccountID(account_id);

    return businessAccount;
  }

  async transferBusinessToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
    const { source_account_id, destination_account_id, amount } = payload;
    const source_account_model = await bussinessAccountRepository.getBusinessAccountByAccountID(source_account_id);
    const destination_account_model = await bussinessAccountRepository.getBusinessAccountByAccountID(destination_account_id);
    const same_company = source_account_model.company_id === destination_account_model.company_id;
    const source_currency = source_account_model.currency;
    const destination_currency = destination_account_model.currency;
    let rate = 1;

    if (same_company && amount > this.transaction_limit_businesses_same_company) {
      throw new TransferError(`transaction between business accounts with same owning company is limited to ${this.transaction_limit_businesses_same_company} coins`);
    }
    if (!same_company && amount > this.transaction_limit_businesses_different_company) {
      throw new TransferError(`transaction between business accounts with diferrent owning companies is limited to ${this.transaction_limit_businesses_different_company} coins`);
    }
    if (source_currency !== destination_currency) {
      rate = await genericFunctions.getRate(source_currency, destination_currency);
    }

    const transaction = await TransferRepository.transfer(payload, rate);

    return (rate !== 1 ? { rate, ...transaction } : transaction) as ITransferResponse;
  }

  async transferBusinessToIndividual(payload: ITransferRequest): Promise<ITransferResponse> {
    if (payload.amount > this.transaction_limit_business_to_individual) {
      throw new TransferError(`transaction from business account to individual account is limited to ${this.transaction_limit_business_to_individual} coins`);
    }
    const transaction = await TransferRepository.transfer(payload, 1);

    return transaction as ITransferResponse;
  }
}

const businessAccountService = new BusinessAccountService();
export default businessAccountService;
