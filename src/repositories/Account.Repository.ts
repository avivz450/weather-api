import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { IIndividualAccount, IAccount, AccountStatuses, IAccountDB } from '../types/account.types.js';
import { IGeneralObj } from '../types/general.types.js';
import { parseAccountQueryResult, parseAccountQueryResultForTransferResponse } from '../utils/db.parser.js';

class AccountRepository {
  async createAccount(payload: IAccount) {
    try {
      let query = 'SELECT currencyID FROM currency WHERE currencyCode = ?';
      //get currencyID with currency code
      const [currency_query_result] = (await sql_con.query(query, [payload.currency])) as unknown as RowDataPacket[][];

      // get statusID from statuses
      query = 'SELECT statusID FROM statusAccount WHERE statusName = ?';
      const [status_query_result] = (await sql_con.query(query, [AccountStatuses.active])) as unknown as RowDataPacket[][];

      //create row in account table
      const account_payload = {
        currencyID: (currency_query_result[0] as IGeneralObj).currencyID,
        balance: payload.balance || 0,
        statusID: (status_query_result[0] as IGeneralObj).statusID,
        agentID: payload.agent_id,
      };

      let insert_query = 'INSERT INTO account SET ?';
      const [account_insertion_result] = (await sql_con.query(insert_query, [account_payload])) as unknown as OkPacket[];

      return account_insertion_result.insertId.toString();
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getAccountByAccountId(account_id: string) {
    try {
      const query = `SELECT accountID, balance, currencyCode, curencyID statusName, agentID
                            FROM account a
                            JOIN statusAccount s 
                            JOIN currency c
                            ON s.statusID=a.statusID AND c.currencyID=a.currencyID
                            WHERE a.accountID = ?`;
      const [account_query] = (await sql_con.query(query, [account_id])) as unknown as RowDataPacket[][];

      return parseAccountQueryResult(account_query[0] as IAccountDB) || null;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getAccountsByAccountIds(account_ids: string[], include_currency_id?: boolean) {
    try {
      const query = `SELECT accountID, balance, currencyCode,statusName, agentID ${include_currency_id ? ',c.currencyID' : ''}
                            FROM account a
                            JOIN statusAccount s 
                            JOIN currency c
                            ON s.statusID=a.statusID AND c.currencyID=a.currencyID
                            WHERE a.accountID IN (?)`;
      const [account_query_result] = (await sql_con.query(query, [account_ids])) as unknown as RowDataPacket[][];

      const accounts: IAccount[] = [];
      (account_query_result as IAccountDB[]).forEach(account => {
        accounts.push(parseAccountQueryResult(account));
      });

      if (accounts.length !== account_ids.length) {
        throw new Error(`One or more of the accounts doesn't exists`);
      }

      return accounts;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage || (err as any).message;
      throw new DatabaseException(errMessasge);
    }
  }

  async changeAccountsStatusesByAccountIds(account_ids: string[], status_to_update: AccountStatuses) {
    try {
      let query = `SELECT statusID FROM statusAccount WHERE statusName = ?`;
      const [status_query_result] = (await sql_con.query(query, [status_to_update])) as unknown as RowDataPacket[][];

      const { statusID } = status_query_result[0];

      const in_placeholder = account_ids.map(() => '?').join(',');
      query = `UPDATE account 
                     SET statusID = ?
                     WHERE accountID IN (${in_placeholder})`;
      const [update_query_result] = (await sql_con.query(query, [statusID, ...account_ids])) as unknown as OkPacket[];

      if (update_query_result.affectedRows) {
        return true;
      } else throw new Error('');
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }
}
const accountRepository = new AccountRepository();
export default accountRepository;
