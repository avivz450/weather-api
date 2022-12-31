import * as logger from '@ajar/marker';
import { Account } from '../../modules/account.js';
import { AccountMongoose } from './modules/account.js';

export class AccountMongoProvider {
  async createAccount(correlation_id: string, account: Account) {
    const method_name = 'AccountMongoProvider/createAccount';
      logger.info(correlation_id, `${method_name} - start`);
      logger.obj(account,`${correlation_id} ${method_name} - input: `);
    try {
          const new_account = new AccountMongoose({
            name: account.name,
            email: account.email,
            is_active: account.is_active,
            is_deleted: account.is_deleted
          })

      const result = await new_account.save();

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

      const result = await AccountMongoose.findById(account_id);

        logger.obj(result,`${correlation_id} ${method_name} - result: `);
        logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw new Error("INVALID_ACCOUNT_ID");
    }
  }

  async updateAccount(correlation_id: string, account: Partial<Account>) {
    const method_name = 'AccountMongoProvider/updateAccount';
      logger.info(correlation_id, `${method_name} - start`);
      logger.obj(account,`${correlation_id} ${method_name} - input: `);

    try {
        const result = await AccountMongoose.findOneAndUpdate(account.id,account, {new: true});

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

      const result = await AccountMongoose.findOneAndUpdate(account_id, {is_deleted:true}, {new: true});

      logger.obj(result,`${correlation_id} ${method_name} - result: `);
        logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }
}

const accountMongoProvider = new AccountMongoProvider();
export default accountMongoProvider;
