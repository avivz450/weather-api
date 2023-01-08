import { Account } from '../../modules/account.js';
import { AccountMongoose } from './modules/account.js';

export class AccountMongoProvider {
  async createAccount(correlation_id: string, account: Account) {
    const method_name = 'AccountMongoProvider/createAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(account, `${correlation_id} ${method_name} - input: `);
    try {
      const new_account = new AccountMongoose({
        name: account.name,
        email: account.email,
        is_active: account.is_active,
        is_deleted: account.is_deleted,
      });

      const result = await new_account.save();

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
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

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      if(err.kind === "ObjectId"){
        throw new Error('INVALID_ACCOUNT_ID');
      }else{
        throw err;
      }
    }
  }

  async getAccounts(correlation_id: string, filters: object) {
    const method_name = 'AccountMongoProvider/getAccounts';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(filters, correlation_id, `${method_name} - input: `);
    try {
      const result = await AccountMongoose.find(filters);

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  async updateAccount(correlation_id: string, account_id: string, account_to_update: Partial<Account>) {
    const method_name = 'AccountMongoProvider/updateAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj({ account_id, account_to_update }, `${correlation_id} ${method_name} - input: `);

    try {
      const result = await AccountMongoose.findByIdAndUpdate(account_id, account_to_update, { new: true });

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      if(err.kind === "ObjectId"){
        throw new Error('INVALID_ACCOUNT_ID');
      }else{
        throw  err;
      }
    }
  }

  async deleteAccount(correlation_id: string, account_id: string) {
    const method_name = 'AccountMongoProvider/deleteAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.verbose(correlation_id, `${method_name} - input: `, account_id);
    try {
      const result = await AccountMongoose.findByIdAndUpdate(account_id, { is_deleted: true }, { new: true, runValidators: true });

      logger.obj(result, `${correlation_id} ${method_name} - result: `);
      logger.info(correlation_id, `${method_name} - end`);
      return result;
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      if(err.kind === "ObjectId"){
        throw new Error('INVALID_ACCOUNT_ID');
      }else{
        throw  err;
      }     }
  }
}

const accountMongoProvider = new AccountMongoProvider();
export default accountMongoProvider;
