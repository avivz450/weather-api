import { Account } from '../modules/account.js';
import accountDBService from './db_service/account.js';

export class AccountService {
  async getAccount(correlation_id: string, account_id: string) {
    const method_name = 'AccountService/getAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: `, account_id);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/getAccount`);
      let account: Account = await accountDBService.getAccount(correlation_id, account_id);

      logger.obj(account, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return account;
    } catch (err) {
      logger.err(correlation_id, `${method_name} error: `, err);
      throw err;
    }
  }

  async getAccounts(correlation_id: string, filters: object) {
    const method_name = 'AccountService/getAccounts';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(filters, correlation_id, `${method_name} - input parameters: `);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/getAccounts`);
      let accounts: Account[] = await accountDBService.getAccounts(correlation_id, filters);

      logger.obj(accounts, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return accounts;
    } catch (err) {
      logger.err(correlation_id, `${method_name} error: `, err);
      throw err;
    }
  }

  async deleteAccount(correlation_id: string, account_id: string) {
    const method_name = 'AccountService/deleteAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: `, account_id);

    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/deleteAccount`);
      const delete_account = await accountDBService.deleteAccount(correlation_id, account_id);

      logger.obj(delete_account, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return delete_account;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async updateAccount(correlation_id: string, account_in: Account) {
    const method_name = 'AccountService/updateAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(account_in, `${correlation_id} ${method_name} - input: `);

    try {
      logger.verbose(correlation_id, `${method_name} - calling Account/validateAccount`);
      account_in.validateAccount(correlation_id);

      logger.verbose(correlation_id, `${method_name} - calling Account/getFieldsToUpdate`);
      const fields_to_update = Account.getUpdateObject(correlation_id, account_in);

      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/updateAccount`);
      let account_after_update: Account = await accountDBService.updateAccount(correlation_id, account_in.id, fields_to_update);

      logger.obj(account_after_update, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);

      return account_after_update;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async createAccount(correlation_id: string, account: Account) {
    const method_name = 'AccountService/createAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(account, `${correlation_id} ${method_name} - input: `);

    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountService/validateCreateAccount`);
      this.validateCreateAccount(correlation_id, account);

      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/createAccount`);
      let result = await accountDBService.createAccount(correlation_id, account);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  private validateCreateAccount(correlation_id: string, account: Account) {
    const method_name = 'AccountService/validateCreateAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(account, `${correlation_id} ${method_name} - input: `);
    try {
      if (!account.name) {
        throw new Error('MISSING_ACCOUNT_NAME');
      }
      if (!account.email) {
        throw new Error('MISSING_ACCOUNT_EMAIL');
      }
      account.validateAccount(correlation_id);
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }
}

const accountService = new AccountService();
export default accountService;
