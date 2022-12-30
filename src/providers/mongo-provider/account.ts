import * as logger from '@ajar/marker';
import { Account } from '../../modules/account.js';

export class AccountMongoProvider {
  async createAccount(correlation_id: string, account: Account) {
    const method_name = 'AccountMongoProvider/createAccount';
      logger.info(correlation_id, `${method_name} - start`);
      logger.obj(account,`${correlation_id} ${method_name} - input: `);
    try {
      const result = {
        account_id: account.id,
        account_name: account.name,
        account_email: account.email,
        account_is_active: account.is_active,
        account_is_deleted: account.is_deleted,
        account_created_at: 1213213,
        account_updated_at: 1213213,
      };

        logger.obj(result,`${correlation_id} ${method_name} - result: `);
        logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async getAccount(correlation_id: string, account_id: string) {
    const method_name = 'AccountMongoProvider/getAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input: `, account_id);
    try {
      const result = {
        account_id: 343453,
        account_name: 'Aviv',
        account_email: 'Avivz450@gmail.com',
        account_is_active: true,
        account_is_deleted: false,
        account_created_at: 1213213,
        account_updated_at: 1213213,
      };

        logger.obj(result,`${correlation_id} ${method_name} - result: `);
        logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `AccountMongoProvider/getAccount error: `, err);
      throw err;
    }
  }

  async updateAccount(correlation_id: string, account: Partial<Account>) {
    const method_name = 'AccountMongoProvider/updateAccount';
      logger.info(correlation_id, `${method_name} - start`);
      logger.obj(account,`${correlation_id} ${method_name} - input: `);

    try {
      const result = {
        account_id: 343453,
        account_name: 'Aviv',
        account_email: 'Avivz450@gmail.com',
        account_is_active: true,
        account_is_deleted: false,
        account_created_at: 1213213,
        account_updated_at: 1213213,
      };

        logger.obj(result,`${correlation_id} ${method_name} - result: `);
        logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async deleteAccount(correlation_id: string, account_id: string) {
    const method_name = 'AccountMongoProvider/deleteAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input: `, account_id);
    try {
      const result = {
        account_id: 343453,
        account_name: 'Aviv',
        account_email: 'Avivz450@gmail.com',
        account_is_active: true,
        account_created_at: 1213213,
        account_updated_at: 1213213,
        account_is_deleted: true,
      };

        logger.obj(result,`${correlation_id} ${method_name} - result: `);
        logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `AccountMongoProvider/getAccount error: `, err);
      throw err;
    }
  }
}

const accountMongoProvider = new AccountMongoProvider();
export default accountMongoProvider;
