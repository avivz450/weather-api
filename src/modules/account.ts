import * as logger from '@ajar/marker';
import { BooleanUtility } from '../utils/boolean-utility.js';
import { EmailUtility } from '../utils/email-utility.js';

export class Account {
  id: string = '';
  name: string = '';
  email: string = '';
  is_active: boolean = true;
  is_deleted: boolean = true;
  created_at: number = 0;
  updated_at: number = 0;

  constructor(account?: Account) {
    if (account) {
      this.id = account.id || '';
      this.name = account.name || '';
      this.email = account.email || '';
      this.is_active = account.is_active || true;
      this.is_deleted = account.is_deleted || false;
      this.created_at = account.created_at || 0;
      this.updated_at = account.updated_at || 0;
    }
  }

  static parseObjectFromRequest(correlation_id: string, req: any): Account {
    const method_name = 'Account/parseFromObjectOrRequest';
    logger.info(correlation_id, `${method_name} - start`);

    let account = new Account();

    account.name = req.body['name'] || '';
    account.email = req.body['email'] || '';
    account.id = req.params['id'] || '';

    return account;
  }

  static parseObjectFromDb(correlation_id: string, data: any): Account {
    const method_name = "Account/parseObjectFromDb"
    logger.obj(data,`${correlation_id} ${method_name} - input: `);

    let account = new Account();

    if (data) {
      account.id = data['account_id'] || '';
      account.name = data['account_name'] || '';
      account.email = data['account_email'] || '';
      account.is_active = data['account_is_active'] ? BooleanUtility.parseToBoolean(correlation_id, data['account_is_active']) : true;
      account.is_deleted = data['account_is_deleted'] ? BooleanUtility.parseToBoolean(correlation_id, data['account_is_deleted']) : false;
      account.created_at = data['account_created_at'] ? Number(data['account_created_at']) : 0;
      account.updated_at = data['account_updated_at'] ? Number(data['account_updated_at']) : 0;
    }

    logger.obj(account,`${correlation_id} ${method_name} - output: `);
    return account;
  }

  static parseListFromDB(correlation_id: string, data_array: Array<object>): Array<Account> {
    const method_name = "Account/parseListFromDB"
    logger.obj(data_array,`${correlation_id} ${method_name} - input: `);

    let accounts: Array<Account> = [];

    if (data_array && data_array.length > 0) {
      data_array.forEach(item => {
        logger.verbose(correlation_id, `Account/parseListFromDB - calling Account/parseObjectFromDb`);
        accounts.push(Account.parseObjectFromDb(correlation_id, item));
      });
    }

    logger.obj(accounts,`${correlation_id} ${method_name} - output: `);
    return accounts;
  }

  static parseObjectToResponse(correlation_id: string, data: Account): object | null {
    const method_name = "Account/parseObjectToResponse";
    logger.obj(data,`${correlation_id} ${method_name} - input: `);

    if (!data) {
      logger.verbose(correlation_id, `Account/parseObjectToResponse - output: `, null);
      return null;
    } else {
      let result = {
        id: data.id || '',
        name: data.name || '',
        email: data.email || '',
        is_active: data.is_active || true,
        is_deleted: data.is_deleted || false,
        created_at: data.created_at || 0,
        updated_at: data.updated_at || 0,
      };

      logger.obj(result,`${correlation_id} ${method_name} - output: `);
      return result;
    }
  }

  static parseListToResponse(correlation_id: string, data_array: Array<Account>): Array<object | null> {
    const method_name = "Account/parseListToResponse";
    logger.obj(data_array,`${correlation_id} ${method_name} - input: `);

    let accounts: Array<object | null> = [];

    if (data_array && data_array.length > 0) {
      data_array.forEach(item => {
        logger.verbose(correlation_id, `Account/parseListToResponse - calling Account/parseObjectToResponse`);
        accounts.push(Account.parseObjectToResponse(correlation_id, item));
      });
    }

    logger.obj(accounts,`${correlation_id} ${method_name} - output: `);
    return accounts;
  }

  static parseDeletedObjectFromDb(correlation_id: string, data: any): object | null {
    const method_name = "Account/parseDeletedObjectFromDb";
    logger.obj(data,`${correlation_id} ${method_name} - input: `);

    if (data) {
      let result = {
        id: data['account_id'] || '',
        is_deleted: data['account_is_deleted'] ? BooleanUtility.parseToBoolean(correlation_id, data['account_is_deleted']) : false,
      };

      logger.obj(result,`${correlation_id} ${method_name} - output: `);
      return result;
    } else {
      logger.verbose(correlation_id, `Account/parseDeletedObjectFromDb - output: `, null);
      return null;
    }
  }

  static parseDeletedObjectToResponse(correlation_id: string, data: any): object | null {
    const method_name = "Account/parseDeletedObjectToResponse";
    logger.obj(data,`${correlation_id} ${method_name} - input: `);
    if (data) {
      let result = {
        is_deleted: data['is_deleted'] || false,
        // The token should be returned as the object ID
        id: data['id'] || '',
      };
      logger.obj(result,`${correlation_id} ${method_name} - output: `);
      return result;
    } else {
      logger.verbose(correlation_id, `Account/parseDeletedObjectToResponse - output: `, null);
      return null;
    }
  }

  static validateTypes(correlation_id: string, data: any) {
    const method_name = 'Account/validateTypes';
    logger.info(correlation_id, `${method_name} - start`);
    try {
      if (data['id'] && typeof data['id'] !== 'string') {
        throw new Error('INVALID_ID_TYPE');
      }
      if (data['name'] && typeof data['name'] !== 'string') {
        throw new Error('INVALID_NAME_TYPE');
      }
      if (data['email'] && typeof data['email'] !== 'string') {
        throw new Error('INVALID_EMAIL_TYPE');
      }
      if (data['is_active'] && typeof data['is_active'] !== 'boolean') {
        throw new Error('INVALID_IS_ACTIVE_TYPE');
      }
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  validateAccount(correlation_id: string) {
    const method_name = 'Account/validateAccount';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(this,`${correlation_id} ${method_name} - input: `);
    try {
      if (this.email && EmailUtility.isValidEmail(this.email) === false) {
        throw new Error('INVALID_EMAIL');
      }
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  getUpdatetableObject(correlation_id: string) {
    const method_name = 'Account/getUpdatetableObject';
    logger.info(correlation_id, `${method_name} - start`);
    logger.obj(this,`${correlation_id} ${method_name} - input: `);
    const updatetable_object: { [key: string]: any } = {};
    const updateable_fields: string[] = ['name'];

    for (const field in this) {
      if (updateable_fields.includes(field)) {
        updatetable_object[field] = this[field];
      }
    }
    logger.obj(updatetable_object,`${correlation_id} ${method_name} - result: `);
    logger.info(correlation_id, `${method_name} - end`);
    return updatetable_object;
  }
}
