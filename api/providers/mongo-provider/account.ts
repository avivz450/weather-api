import { Account } from '../../modules/account.js';
import { AccountMongoose } from './modules/account.js';

export class AccountMongoProvider {
  async createAccount(correlationId: string, account: Account) {
    const methodName = 'accountMongoProvider/createAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(account, `${correlationId} ${methodName} - input: `);
    try {
      const newAccount = new AccountMongoose(account);
      const result = await newAccount.save();
      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error: `, err);
      if (err.code === 11000) {
        throw new Error('DUPLICATE_ACCOUNT_EMAIL');
      }
      throw err;
    }
  }

  async getAccount(correlationId: string, accountId: string) {
    const methodName = 'accountMongoProvider/getAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.verbose(correlationId, `${methodName} - input: `, accountId);
    try {
      const result = await AccountMongoose.findById(accountId);
      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error: `, err);
      if (err.kind === "ObjectId") {
        throw new Error('INVALID_ACCOUNT_ID');
      } else {
        throw err;
      }
    }
  }

  async getAccounts(correlationId: string, filters: object) {
    const methodName = 'accountMongoProvider/getAccounts';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(filters, `${correlationId} ${methodName} - input: `);
    try {
      const result = await AccountMongoose.find(filters);
      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error: `, err);
      throw err;
    }
  }

  async updateAccount(correlationId: string, accountId: string, accountToUpdate: Partial<Account>) {
    const methodName = 'accountMongoProvider/updateAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj({ accountId, accountToUpdate }, `${correlationId} ${methodName} - input: `);

    try {
      const result = await AccountMongoose.findOneAndUpdate({ _id: accountId }, accountToUpdate, { new: true });
      if (result === null) {
        throw new Error('INVALID_ACCOUNT_ID');
      }
      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error: `, err);
      throw err;
    }
  }

  async deleteAccount(correlationId: string, accountId: string) {
    const methodName = 'accountMongoProvider/deleteAccount';
    logger.info(correlationId, `${methodName} - start`);
    logger.verbose(correlationId, `${methodName} - input: `, accountId);
    try {
      const result = await AccountMongoose.findByIdAndUpdate(accountId, { isDeleted: true }, { new: true, runValidators: true });
      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error: `, err);
      if (err.kind === "ObjectId") {
        throw new Error('INVALID_ACCOUNT_ID');
      } else {
        throw err;
      }
    }
  }
}

const accountMongoProvider = new AccountMongoProvider();
export { accountMongoProvider };
