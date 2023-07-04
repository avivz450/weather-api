import { BooleanUtility } from '../utils/boolean-utility.js';
import { EmailUtility } from '../utils/email-utility.js';

export class Account {
  id: string = '';
  name: string = '';
  email: string = '';
  isActive: boolean = true;
  isDeleted: boolean = false;
  createdAt: number = 0;
  updatedAt: number = 0;
  static updateableFields: string[] = ['name'];

  constructor(account?: Partial<Account>) {
    if (account) {
      ({ id: this.id = '', name: this.name = '', email: this.email = '', isActive: this.isActive = true, isDeleted: this.isDeleted = false, createdAt: this.createdAt = 0, updatedAt: this.updatedAt = 0 } = account);
    }
  }

  static parseObjectFromRequest(correlationId: string, req: any): Account {
    const account = new Account();
    account.name = req.body?.name ?? '';
    account.email = req.body?.email ?? '';
    account.id = req.params?.["account_id"] ?? '';

    return account;
  }

  static parseObjectFromDb(correlationId: string, data: any): Account {
    const account = new Account();
    if (data) {
      account.id = data.id ?? '';
      account.name = data.name ?? '';
      account.email = data.email ?? '';
      account.isActive = BooleanUtility.parseToBoolean(correlationId, data.isActive) ?? true;
      account.isDeleted = BooleanUtility.parseToBoolean(correlationId, data.isDeleted) ?? false;
      account.createdAt = Number(data.createdAt) ?? 0;
      account.updatedAt = Number(data.updatedAt) ?? 0;
    }
    return account;
  }

  static parseListFromDb(correlationId: string, dataArray: Array<object>): Array<Account> {
    const accounts: Account[] = [];
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(item => {
        accounts.push(Account.parseObjectFromDb(correlationId, item));
      });
    }
    return accounts;
  }

  static parseObjectToResponse(correlationId: string, data: Account): object | null {
    if (!data) {
      return null;
    } else {
      const result = {
        id: data.id ?? '',
        name: data.name ?? '',
        email: data.email ?? '',
        isActive: data.isActive ?? true,
        isDeleted: data.isDeleted ?? false,
        createdAt: data.createdAt ?? 0,
        updatedAt: data.updatedAt ?? 0,
      };
      return result;
    }
  }

  static parseListToResponse(correlationId: string, dataArray: Account[]): (object | null)[] {
    const accounts: (object | null)[] = [];
    if (dataArray && dataArray.length > 0) {
      dataArray.forEach(item => {
        accounts.push(Account.parseObjectToResponse(correlationId, item));
      });
    }
    return accounts;
  }

  static parseDeletedObjectToResponse(correlationId: string, data: any): object | null {
    if (data) {
      const result = {
        isDeleted: data.isDeleted ?? false,
        id: data.id ?? '',
      };
      return result;
    } else {
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

      try {
        BooleanUtility.parseToBoolean(correlation_id, data['is_active']);
      } catch (e) {
        throw new Error('INVALID_IS_ACTIVE_TYPE');
      }

      try {
        BooleanUtility.parseToBoolean(correlation_id, data['is_deleted']);
      } catch (e) {
        throw new Error('INVALID_IS_DELETED_TYPE');
      }
    } catch (err) {
      logger.err(correlation_id, `${method_name} - error: `, err);
      throw err;
    }
  }

  validateAccount(correlationId: string) {
    if (this.email && !EmailUtility.isValidEmail(this.email)) {
      throw new Error('INVALID_EMAIL');
    }
  }

  getUpdateObject(correlationId: string) {
    const updateObject = Object.keys(this).reduce(
        (accumulator, key) => {
          if (Account.updateableFields.includes(key)) {
            accumulator[key] = this[key];
          }
          return accumulator;
        },
        {}
    );
    return updateObject;
  }
}
