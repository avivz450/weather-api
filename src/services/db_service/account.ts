import logger from "@ajar/marker";
import {Account} from "../../modules/account.js";
import accountMongoProvider from "../../providers/mongo-provider/account.js";

export class AccountDBService {
  async createAccount(correlation_id:string, account: Account): Promise<Account> {
    const method_name = "AccountDBService/createAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: Account-`, account);

    try {
      logger.verbose(correlation_id, `${method_name} - calling MySQLProvider/createAccount`);
      let created_Account = await accountMongoProvider.createAccount(correlation_id,account);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, created_Account);

      logger.info(correlation_id, `${method_name} - end. result-`, result);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err
    }
  }

  async getAccount(correlation_id: string, account_id:string): Promise<Account> {
    const method_name = "AccountDBService/getAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: account_id -`, account_id);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMySQLProvider/getAccount`);
      let retrieved_Account_db = await accountMongoProvider.getAccount(correlation_id, account_id);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, retrieved_Account_db);

      logger.info(correlation_id, `${method_name} - end. result:`, result);
      return result
    } catch (err) {
      logger.err(correlation_id, `AccountDBService/getAccount error: `, err);
      throw err;
    }
  }

  async updateAccount(correlation_id:string, account: Partial<Account>): Promise<Account> {
    const method_name = "AccountDBService/updateAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: Account-`, account);

    try {
      logger.verbose(correlation_id, `${method_name} - calling MySQLProvider/updateAccount`);
      let created_Account = await accountMongoProvider.updateAccount(correlation_id,account);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, created_Account);

      logger.info(correlation_id, `${method_name} - end. result-`, result);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err
    }
  }

  async deleteAccount(correlation_id: string, account_id:string): Promise<Account> {
    const method_name = "AccountDBService/deleteAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: account_id -`, account_id);
    try {
      logger.verbose(correlation_id, `${method_name} - calling AccountMySQLProvider/deleteAccount`);
      let retrieved_Account_db = await accountMongoProvider.deleteAccount(correlation_id, account_id);

      logger.verbose(correlation_id, `${method_name} - calling Account/parseObjectFromDb`);
      let result = Account.parseObjectFromDb(correlation_id, retrieved_Account_db);

      logger.info(correlation_id, `${method_name} - end. result:`, result);
      return result
    } catch (err) {
      logger.err(correlation_id, `AccountDBService/getAccount error: `, err);
      throw err;
    }  }
}

const accountDBService = new AccountDBService();
export default accountDBService;
