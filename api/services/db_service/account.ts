import { Account } from '../../modules/account.js';
import { accountMongoProvider } from '../../providers/mongo-provider/account.js';

export class AccountDBService {
  async createAccount(correlationId: string, account: Account): Promise<Account> {
    const methodName = 'AccountDBService/createAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(account, `${correlationId} ${methodName} - input: `);

    try {
      const createdAccount = await accountMongoProvider.createAccount(correlationId, account);
      const result = Account.parseObjectFromDb(correlationId, createdAccount);

      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (error) {
      logger.err(correlationId, `${methodName} - error: `, error);
      throw error;
    }
  }

  async getAccount(correlationId: string, accountId: string): Promise<Account> {
    const methodName = 'AccountDBService/getAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.verbose(correlationId, `${methodName} - input: `, accountId);

    try {
      const retrievedAccountDb = await accountMongoProvider.getAccount(correlationId, accountId);
      const result = Account.parseObjectFromDb(correlationId, retrievedAccountDb);

      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (error) {
      logger.err(correlationId, `${methodName} - error: `, error);
      throw error;
    }
  }

  async getAccounts(correlationId: string, filters: object): Promise<Account[]> {
    const methodName = 'AccountDBService/getAccounts';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(filters, correlationId, `${methodName} - input: `);

    try {
      const retrievedAccountsDb = await accountMongoProvider.getAccounts(correlationId, filters);
      const result = Account.parseListFromDb(correlationId, retrievedAccountsDb);

      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (error) {
      logger.err(correlationId, `${methodName} - error: `, error);
      throw error;
    }
  }

  async updateAccount(correlationId: string, accountId: string, accountToUpdate: Partial<Account>): Promise<Account> {
    const methodName = 'AccountDBService/updateAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj({ accountId, accountToUpdate }, `${correlationId} ${methodName} - input: `);

    try {
      const updatedAccount = await accountMongoProvider.updateAccount(correlationId, accountId, accountToUpdate);
      const result = Account.parseObjectFromDb(correlationId, updatedAccount);

      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (error) {
      logger.err(correlationId, `${methodName} - error: `, error);
      throw error;
    }
  }

  async deleteAccount(correlationId: string, accountId: string): Promise<Account> {
    const methodName = 'AccountDBService/deleteAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.verbose(correlationId, `${methodName} - input: `, accountId);

    try {
      const retrievedAccountDb = await accountMongoProvider.deleteAccount(correlationId, accountId);
      const result = Account.parseObjectFromDb(correlationId, retrievedAccountDb);

      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (error) {
      logger.err(correlationId, `${methodName} - error: `, error);
      throw error;
    }
  }
}

const accountDBService = new AccountDBService();
export {accountDBService};
