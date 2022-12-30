import {Account} from "../modules/account";
import logger from "@ajar/marker";
import pkg from 'uuid';
import accountDBService from "./db_service/account";

class AccountService {
  async createAccount(correlation_id:string, account: Account) {
    const method_name = "AccountService/createAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: Account-`, account);

    try {
      this.validateCreateAccount(correlation_id, account)
      const { v4: uuid } = pkg;
      account.id = uuid();

      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/createAccount`);
      let returnResult = await accountDBService.createAccount(correlation_id, account);

      logger.verbose(correlation_id, `${method_name} - result:`, returnResult);
      logger.info(correlation_id, `${method_name} - end`);
      return returnResult;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async getAccount(correlation_id: string, account_id: string) {
    const method_name = "AccountService/getAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: `,account_id);
    try {
      logger.verbose(correlation_id, `AccountService/getAccount - calling AccountDBService/getAccount`);
      let account: Account = await accountDBService.getAccount(correlation_id, account_id);

        logger.info(correlation_id, `${method_name} - end. account:`, account);
        return account;
    } catch (err) {
      logger.err(correlation_id, `${method_name} error: `, err);
      throw err;
    }

  }

  async updateAccount(correlation_id: string, account_in: Account) {
    const method_name = "AccountService/updateAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters:`, account_in);

    try {
      logger.verbose(correlation_id, `${method_name} - calling Account/validateAccount`);
      account_in.validateAccount(correlation_id);

      logger.verbose(correlation_id, `${method_name} - calling AccountService/getAccount`);
      await this.getAccount(correlation_id, account_in.id);

      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/updateAccount`);
      let account_after_update: Account = await accountDBService.updateAccount(correlation_id, account_in.getUpdatetableObject(correlation_id));

      logger.verbose(correlation_id, `${method_name} - result:`, account_after_update);
      logger.info(correlation_id, `${method_name} - end`);

      return account_after_update;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }

  }

  async deleteAccount(correlation_id: string, account_id: string) {
    const method_name = "AccountService/deleteAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: `,account_id);

    try {
      //maybe don't need ?
      logger.verbose(correlation_id, `${method_name} - calling AccountService/getAccount`);
      await this.getAccount(correlation_id, account_id);

      logger.verbose(correlation_id, `${method_name} - calling AccountDBService/deleteAccount`);
      const delete_Account = await accountDBService.deleteAccount(correlation_id,account_id);

      logger.verbose(correlation_id, `${method_name} - delete_Account: `, delete_Account);
      logger.info(correlation_id, `${method_name} - end`);

      return delete_Account;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  private validateCreateAccount(correlation_id: string, account: Account) {
    const method_name = "AccountService/validateCreateAccount";
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input parameters: Account-`, account);
    try{
      if(!account.name){
        throw new Error("ACCOUNT_NAME_NOT_INSERTED")
      }

      account.validateAccount(correlation_id);
    }catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }
}

const accountService = new AccountService();
export default accountService;
