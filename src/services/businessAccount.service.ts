import { AccountTypes, IBusinessAccount, ITransferRequest, ITransferResponse } from '../types/account.types.js';
import bussinessAccountRepository from '../repositories/bussinessAccount.repository.js';
import TransferRepository from '../repositories/transfer.repository.js';
import TransferError from '../exceptions/transfer.exception.js';
import businessAccountValidator from '../modules/businessAccount.validation.js';
import genericFunctions from '../utils/generic.functions.js';
import accountValidationUtils from '../utils/account.validator.js';
class BusinessAccountService {
  private readonly _transaction_limit_businesses_same_company = 10000;
  private readonly _transaction_limit_businesses_different_company = 1000;
  private readonly _transaction_limit_business_to_individual = 1000;

  get transaction_limit_businesses_same_company() {
    return this._transaction_limit_businesses_same_company;
  }
  get transaction_limit_businesses_different_company() {
    return this._transaction_limit_businesses_different_company;
  }
  get transaction_limit_business_to_individual() {
    return this._transaction_limit_business_to_individual;
  }

  async createBusinessAccount(payload: Omit<IBusinessAccount, 'account_id'>): Promise<IBusinessAccount> {
    const account_id: string = await bussinessAccountRepository.createBusinessAccount(payload);
    const business_account = await this.getBusinessAccount(account_id);

    return business_account;
  }

  async getBusinessAccount(account_id: string): Promise<IBusinessAccount> {
    const [businessAccount] = (await bussinessAccountRepository.getBusinessAccountsByAccountIds([account_id])) as IBusinessAccount[];

    return businessAccount;
  }

  async transferBusinessToBusiness(payload: ITransferRequest): Promise<ITransferResponse> {
    const { source_account_id, destination_account_id, amount } = payload;
    const [source_account_model, destination_account_model] = await bussinessAccountRepository.getBusinessAccountsByAccountIds([source_account_id, destination_account_id]);
    const same_company = source_account_model.company_id === destination_account_model.company_id;
    const source_currency = source_account_model.currency;
    const destination_currency = destination_account_model.currency;
    let rate = 1;

    if (!accountValidationUtils.isBalanceAllowsTransfer(source_account_model, Number(payload.amount), AccountTypes.Business)) {
      throw new TransferError(`balance after transaction will be below the minimal remiaining balance of business account (${businessAccountValidator.minAmountOfBalance})`);
    }
    if (same_company && amount > this.transaction_limit_businesses_same_company) {
      throw new TransferError(`transaction between business accounts with same owning company is limited to ${this.transaction_limit_businesses_same_company} coins`);
    }
    if (!same_company && amount > this.transaction_limit_businesses_different_company) {
      throw new TransferError(`transaction between business accounts with diferrent owning companies is limited to ${this.transaction_limit_businesses_different_company} coins`);
    }
    if (source_currency !== destination_currency) {
      rate = await genericFunctions.getRate(source_currency, destination_currency);
      console.log(rate);
    }

    const transaction = await TransferRepository.transfer(payload, rate);
    const transfer_response = (rate !== 1 ? { rate, ...transaction } : transaction) as ITransferResponse;

    return transfer_response;
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
