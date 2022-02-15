import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { DetailsLevel, IAccount, IFamilyAccount, IFamilyAccountCreationInput, IndividualTransferDetails } from '../types/account.types.js';
import { IFamilyAccountParse } from '../types/db.types.js';
import { parseFamilyAccountsQueryResult } from '../utils/db.parser.js';
import AccountRepository from './account.repository.js';
import individualAccountRepository from './individualAccount.repository.js';

class FamilyAccountRepository {
  async createFamilyAccount(payload: Omit<IFamilyAccountCreationInput, 'account_id'>) {
    //insert new account row
    const new_account_id = await AccountRepository.createAccount(payload as unknown as IAccount);
    try {
      //insert new family account row with new account id
      const family_account_payload = {
        accountID: new_account_id,
        context: payload.context || null,
      };
      let insert_query = 'INSERT INTO familyAccount SET ?';

      (await sql_con.query(insert_query, [family_account_payload])) as unknown as OkPacket[];

      return new_account_id;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async addIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_ids: string[]) {
    try {
      //Added each individual account id to ownersFamilyAccount
      let placeholder = individual_accounts_ids.map(() => '(?, ?)').join(',');
      let insert_query = `INSERT INTO ownersFamilyAccount
                                (familyAccountID, individualAccountID)
                                VALUES ${placeholder}`;

      let values: string[] = [];
      individual_accounts_ids.forEach(individual_account_id => {
        values.push(family_account_id);
        values.push(individual_account_id);
      });

      const [account_insertion_result] = (await sql_con.query(insert_query, [...values])) as unknown as OkPacket[];

      if (account_insertion_result.insertId) {
        return true;
      } else throw Error('');
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async transferFromIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_transfer_details: IndividualTransferDetails[]) {
    try {
      //iterate over tuples -> calc amount to add to family
      const total_transfer_amount = individual_accounts_transfer_details.reduce((total_amount, individual_account_details) => {
        total_amount += individual_account_details[1];
        return total_amount;
      }, 0);
      //subtract from each account his amount
      let individual_account_when_placeholder = individual_accounts_transfer_details.map(() => 'WHEN accountID = ? THEN balance-?').join('\n\t\t\t\t\t\t\t\t ');
      individual_accounts_transfer_details.push([family_account_id, total_transfer_amount]); //push family account id and total amount to add to balance
      let values_placeholder = individual_accounts_transfer_details.map(() => '?').join(',');
      let update_query = `UPDATE account SET balance = (
                                CASE ${individual_account_when_placeholder}
                                WHEN accountID = ? THEN balance+?
                                END)
                                WHERE accountID in (${values_placeholder})`;

      let values: (string | number)[] = [];
      individual_accounts_transfer_details.forEach(individual_transfer_details => {
        values.push(individual_transfer_details[0]); //push individual account id
        values.push(individual_transfer_details[1]); //push its amount to subtract
      });
      individual_accounts_transfer_details.forEach(individual_transfer_details => {
        values.push(individual_transfer_details[0]); //push again individual account ids for where clause
      });
      values.push(family_account_id); //push also family account id for where clause

      const [account_update_result] = (await sql_con.query(update_query, [...values])) as unknown as OkPacket[];

      if (account_update_result.affectedRows) {
        return true;
      } else throw Error('');
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async removeIndividualAccountsFromFamilyAccount(family_account_id: string, individual_accounts_ids: string[]) {
    try {
      let in_placeholder = individual_accounts_ids.map(() => '?').join(',');
      let insert_query = `DELETE FROM ownersFamilyAccount
                               WHERE individualAccountID IN (${in_placeholder})
                               AND familyAccountID IN (${family_account_id})`;

      const [account_deletion_result] = (await sql_con.query(insert_query, [...individual_accounts_ids])) as unknown as OkPacket[];

      if (account_deletion_result.affectedRows) {
        return true;
      } else throw Error('');
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async transferFromFamilyAccountToIndividualAccounts(family_account_id: string, individual_accounts_transfer_details: IndividualTransferDetails[]) {
    try {
      //iterate over tuples -> calc amount to subtract from family
      const total_transfer_amount = individual_accounts_transfer_details.reduce((total_amount, individual_account_details) => {
        total_amount += Number(individual_account_details[1]);
        return total_amount;
      }, 0);

      //subtract from family account the total amount and add to each individual his amount
      let individual_account_when_placeholder = individual_accounts_transfer_details.map(() => 'WHEN accountID = ? THEN balance+?').join('\n\t\t\t\t\t\t\t\t ');
      individual_accounts_transfer_details.push([family_account_id, total_transfer_amount]); //push family account id and total amount to subtract to balance
      let values_placeholder = individual_accounts_transfer_details.map(() => '?').join(',');
      let insert_query = `UPDATE account SET balance = (
                                CASE ${individual_account_when_placeholder}
                                WHEN accountID = ? THEN balance-?
                                END)
                                WHERE accountID in (${values_placeholder})`;

      let values: (string | number)[] = [];
      individual_accounts_transfer_details.forEach(individual_transfer_details => {
        values.push(individual_transfer_details[0]); //push individual account id
        values.push(individual_transfer_details[1]); //push its amount to add
      });
      individual_accounts_transfer_details.forEach(individual_transfer_details => {
        values.push(individual_transfer_details[0]); //push again individual account ids for where clause
      });
      values.push(family_account_id); //push also family account id for where clause

      const [account_update_result] = (await sql_con.query(insert_query, [...values])) as unknown as OkPacket[];

      if (account_update_result.affectedRows) {
        return true;
      } else throw Error('');
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getOwnersByFamilyAccountId(family_account_id: string) {
    //return all account owners ids in array
    try {
      let query = `SELECT DISTINCT individualAccountID
                        FROM account a
                        JOIN ownersFamilyAccount o
                        ON a.accountID=o.familyAccountID
                        WHERE o.familyAccountID = ?`;
      const [get_owners_query_result] = (await sql_con.query(query, [family_account_id])) as unknown as RowDataPacket[][];

      // parse to array of string ids
      return get_owners_query_result
        .map(owner_id => {
          return owner_id.individualAccountID as string;
        })
        .filter((value, index, self) => self.indexOf(value) === index);
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getFamilyAccountsByAccountIds(family_account_ids: string[], details_level: DetailsLevel) {
    try {
      let payload = {};

      if (details_level === DetailsLevel.short) {
        //get family account return after parse
        let query = `SELECT DISTINCT a.accountID, c.currencyCode, s.statusName, a.balance, fa.context, ow.individualAccountID
                        FROM account AS a 
                        JOIN familyAccount AS fa ON a.accountID= fa.accountID
                        LEFT JOIN ownersFamilyAccount ow ON ow.familyAccountID=fa.accountID
                        JOIN statusAccount AS s ON s.statusID=a.statusID
                        JOIN currency AS c ON c.currencyID=a.currencyID 
                        WHERE a.accountID IN (?)`;
        const [account_query_result] = (await sql_con.query(query, [family_account_ids])) as unknown as RowDataPacket[][];

        if (account_query_result.length === 0) {
          throw new Error(`family account with the id of ${family_account_ids} doesn't exists`);
        }

        payload = {
          query_res: account_query_result,
        } as IFamilyAccountParse;
      } else if (details_level === DetailsLevel.full) {
        let query = `SELECT DISTINCT a.accountID, c.currencyCode, s.statusName, a.balance, fa.context, ow.individualAccountID
                      FROM account AS a 
                      JOIN familyAccount AS fa ON a.accountID= fa.accountID
                      LEFT JOIN ownersFamilyAccount ow ON ow.familyAccountID=fa.accountID
                      JOIN statusAccount AS s ON s.statusID=a.statusID
                      JOIN currency AS c ON c.currencyID=a.currencyID 
                      WHERE a.accountID IN (?)`;
        const [account_query_result] = (await sql_con.query(query, [family_account_ids])) as unknown as RowDataPacket[][];

        if (account_query_result.length === 0) {
          throw new Error(`family account with the id of ${family_account_ids} doesn't exists`);
        }

        const all_accounts_owners: string[] = account_query_result.map(row => row.individualAccountID);
        const owners_full = await individualAccountRepository.getIndividualAccountsByAccountIds(all_accounts_owners);
        payload = {
          query_res: account_query_result,
          owners_full,
        };
      }
      const familyAccounts = parseFamilyAccountsQueryResult(payload as IFamilyAccountParse, details_level) as IFamilyAccount[];

      familyAccounts.forEach(family_account => {
        if (family_account.owners === null) {
          throw new Error(`family account with the id ${family_account.account_id} doesn't exists`);
        }
      });

      return parseFamilyAccountsQueryResult(payload as IFamilyAccountParse, details_level);
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage || (err as any).message;
      throw new DatabaseException(errMessasge);
    }
  }
}

const familyAccountRepository = new FamilyAccountRepository();
export default familyAccountRepository;
