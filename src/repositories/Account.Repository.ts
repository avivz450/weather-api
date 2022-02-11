import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import {
  IBusinessAccount,
  ITransferRequest,
  ITransferResponse,
  IIndividualAccount,
  IAccount,
} from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';
import bussinessAccountRepository from './bussinessAccount.repository.js';

class AccountRepository {
  async createAccount(payload: IAccount) {
    try {
      let query = 'SELECT currencyID FROM currency WHERE currencyCode = ?';
      //get currencyID with currency code
      const [currency_query_result] = (await sql_con.query(query, [
        payload.currency,
      ])) as unknown as RowDataPacket[];

      // get statusID from statuses
      query = 'SELECT statusID FROM statusAccount WHERE statusName = ?';
      const [status_query_result] = (await sql_con.query(query, [
        'active',
      ])) as unknown as RowDataPacket[];

      //create row in account table
      const account_payload = {
        currencyID: (currency_query_result[0] as IGeneralObj).currencyID,
        balance: payload.balance || 0,
        statusID: (status_query_result[0] as IGeneralObj).statusID,
      };

      let insert_query = 'INSERT INTO account SET ?';
      const [account_insertion_result] = (await sql_con.query(
        insert_query,
        account_payload,
      )) as unknown as OkPacket[];

      return account_insertion_result.insertId.toString();
    } catch (err) {
      throw new DatabaseException('Failed to create account');
    }
  }

  async getAccountByAccountId(account_id: string) {
    try {
      const query = 'SELECT * FROM account WHERE accountID = ?';
      const [account_query] = (await sql_con.query(query, [
        account_id,
      ])) as unknown as RowDataPacket[];

      return (account_query[0] as IIndividualAccount) || null;
    } catch (err) {
      throw new DatabaseException('Failed to get account details');
    }
  }

  async changeStatusAccountsByAccountIds(statuses_to_update: string, account_ids: string) {}
}

const accountRepository = new AccountRepository();
export default accountRepository;
