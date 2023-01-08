import { Account } from '../../modules/account.js';
import accountMongoProvider from '../../providers/mongo-provider/account.js';

export class AccountDBService {
  async createAccount(correlation_id: string, account: Account): Promise<Account> {
    const method_name = 'AccountDBService/createAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(account, `${correlation_id} ${method_name} - input: `);

    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMongoProvider/createAccount`);
      let created_Account = await accountMongoProvider.createAccount(correlation_id, account);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, created_Account);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async getAccount(correlation_id: string, account_id: string): Promise<Account> {
    const method_name = 'AccountDBService/getAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input: `, account_id);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMongoProvider/getAccount`);
      let retrieved_Account_db = await accountMongoProvider.getAccount(correlation_id, account_id);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, retrieved_Account_db);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async getAccounts(correlation_id: string, filters: object): Promise<Account[]> {
    const method_name = 'AccountDBService/getAccounts';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(filters, correlation_id, `${method_name} - input: `);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMongoProvider/getAccounts`);
      let retrieved_accounts_db = await accountMongoProvider.getAccounts(correlation_id, filters);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseListFromDB(correlation_id, retrieved_accounts_db);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async updateAccount(correlation_id: string, account_id: string, account_to_update: Partial<Account>): Promise<Account> {
    const method_name = 'AccountDBService/updateAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj({ account_id, account_to_update }, `${correlation_id} ${method_name} - input: `);

    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMongoProvider/updateAccount`);
      let updated_account = await accountMongoProvider.updateAccount(correlation_id, account_id, account_to_update);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, updated_account);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async deleteAccount(correlation_id: string, account_id: string): Promise<Account> {
    const method_name = 'AccountDBService/deleteAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input: `, account_id);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMongoProvider/deleteAccount`);
      let retrieved_account_db = await accountMongoProvider.deleteAccount(correlation_id, account_id);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, retrieved_account_db);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }
}

const accountDBService = new AccountDBService();
export default accountDBService;
