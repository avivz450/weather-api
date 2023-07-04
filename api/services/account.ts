import { Account } from '../modules/account.js';
import { accountDBService } from './db_service/account.js';

export class AccountService {
  async getAccount(correlationId: string, accountId: string): Promise<Account> {
    const methodName = 'AccountService/getAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.verbose(correlationId, `${methodName} - input parameters:`, accountId);

    try {
      logger.verbose(correlationId, `${methodName} - calling AccountDBService/getAccount`);
      const account: Account = await accountDBService.getAccount(correlationId, accountId);

      logger.obj(account, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);
      return account;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  async getAccounts(correlationId: string, filters: object): Promise<Account[]> {
    const methodName = 'AccountService/getAccounts';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(filters, correlationId, `${methodName} - input parameters:`);

    try {
      logger.verbose(correlationId, `${methodName} - calling AccountDBService/getAccounts`);
      const accounts: Account[] = await accountDBService.getAccounts(correlationId, filters);

      logger.obj(accounts, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);
      return accounts;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  async deleteAccount(correlationId: string, accountId: string): Promise<Account> {
    const methodName = 'AccountService/deleteAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.verbose(correlationId, `${methodName} - input parameters:`, accountId);

    try {
      logger.verbose(correlationId, `${methodName} - calling AccountDBService/deleteAccount`);
      const deleteAccount = await accountDBService.deleteAccount(correlationId, accountId);

      logger.obj(deleteAccount, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);
      return deleteAccount;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  async updateAccount(correlationId: string, accountIn: Account): Promise<Account> {
    const methodName = 'AccountService/updateAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(accountIn, `${correlationId} ${methodName} - input:`);

    try {
      logger.verbose(correlationId, `${methodName} - calling Account/validateAccount`);
      accountIn.validateAccount(correlationId);

      logger.verbose(correlationId, `${methodName} - calling Account/getFieldsToUpdate`);
      const fieldsToUpdate = accountIn.getUpdateObject(correlationId);

      logger.verbose(correlationId, `${methodName} - calling AccountDBService/updateAccount`);
      const accountAfterUpdate: Account = await accountDBService.updateAccount(correlationId, accountIn.id, fieldsToUpdate);

      logger.obj(accountAfterUpdate, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);

      return accountAfterUpdate;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  async createAccount(correlationId: string, account: Account): Promise<any> {
    const methodName = 'AccountService/createAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(account, `${correlationId} ${methodName} - input:`);

    try {
      logger.verbose(correlationId, `${methodName} - calling AccountService/validateCreateAccount`);
      this.validateCreateAccount(correlationId, account);

      logger.verbose(correlationId, `${methodName} - calling AccountDBService/createAccount`);
      const result = await accountDBService.createAccount(correlationId, account);

      logger.obj(result, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  private validateCreateAccount(correlationId: string, account: Account): void {
    const methodName = 'AccountService/validateCreateAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(account, `${correlationId} ${methodName} - input:`);

    try {
      if (!account.name) {
        throw new Error('MISSING_ACCOUNT_NAME');
      }
      if (!account.email) {
        throw new Error('MISSING_ACCOUNT_EMAIL');
      }
      account.validateAccount(correlationId);
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }
}

const accountService = new AccountService();
export { accountService };
