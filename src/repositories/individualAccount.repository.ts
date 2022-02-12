import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { IIndividualAccount, IIndividualAccountDB, IAccount } from '../types/account.types';
import { IGeneralObj } from '../types/general.types.js';
import { createAddressPayload, parseIndividualAccountQueryResult } from '../utils/db.parser.js';
import { AccountRepository } from './Account.Repository.js';

class IndividualAccountRepository {
  async createIndividualAccount(payload: Omit<IIndividualAccount, 'account_id'>) {
    try {
      const new_account_id = await AccountRepository.createAccount(payload as unknown as IAccount);

      //create row in address table
      const address_payload = createAddressPayload(payload);
      let insert_query = 'INSERT INTO address SET ?';
      const [address_insertion] = (await sql_con.query(
      insert_query,
      [address_payload]
      )) as unknown as OkPacket[];

      //create row in individualAccount table
      const individual_payload = {
          accountID: new_account_id,
          individualID: payload.individual_id,
          firstName: payload.first_name,
          lastName: payload.last_name,
          email: payload.email || null,
          addressID: address_insertion.insertId
      };

      insert_query = 'INSERT INTO individualAccount SET ?';
      await sql_con.query(insert_query, [individual_payload]);

      return new_account_id;
    } catch (err) {
      throw new DatabaseException('Failed to create individual account');
    }
  }

  async getIndividualAccountByAccountId(account_id: string) {
    try {
      let query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName, ad.countryCode, ad.postalCode, ad.city, ad.region, ad.streetName, ad.streetNumber
                      FROM account AS a 
                      LEFT JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                      LEFT JOIN statusAccount AS s ON s.statusID=a.statusID
                      LEFT JOIN currency AS c ON c.currencyID=a.currencyID
                      LEFT JOIN address AS ad ON ad.addressID=ia.addressID
                      LEFT JOIN country as co ON co.countryCode=ad.countryCode
                      WHERE a.accountID = ?`;
      const [account_query_result] = (await sql_con.query(query, [
        account_id,
      ])) as unknown as RowDataPacket[];

      return parseIndividualAccountQueryResult(account_query_result[0]);
    } catch (err) {
      throw new DatabaseException('Failed to get individual account details');
    }
  }

  async getIndividualAccountsByAccountIds(account_ids: string[]) {
    try {
      const query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName ,ad.*
                      FROM account AS a 
                      JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                      JOIN statusAccount AS s ON s.statusID=a.statusID
                      JOIN currency AS c ON c.currencyID=a.currencyID
                      JOIN address AS ad ON ad.addressID=ia.addressID
                      JOIN country as co ON co.countryCode=ad.countryCode
                      WHERE a.accountID IN (${'?,'.repeat(account_ids.length).slice(0, -1)})`;

      const [individual_accounts_result_query] = (await sql_con.query(query, [
        ...account_ids,
      ])) as unknown as RowDataPacket[];
      const IndividualAccounts: IIndividualAccount[] = [];

      (individual_accounts_result_query as IIndividualAccountDB[]).forEach(individualAccount => {
        IndividualAccounts.push(parseIndividualAccountQueryResult(individualAccount));
      });

      return IndividualAccounts;
    } catch (err) {
      throw new DatabaseException('Failed to get individual accounts details');
    }
  }

  async getIndividualAccountsByIndividualIds(individual_ids: string[]) {
    try {
      const query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName, ad.*
                      FROM account AS a 
                      JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                      JOIN statusAccount AS s ON s.statusID=a.statusID
                      JOIN currency AS c ON c.currencyID=a.currencyID
                      JOIN address AS ad ON ad.addressID=ia.addressID
                      JOIN country as co ON co.countryCode=ad.countryCode
                      WHERE ia.individualID IN (${'?,'
                        .repeat(individual_ids.length)
                        .slice(0, -1)})`;

      const [individual_accounts_result_query] = (await sql_con.query(query, [
        ...individual_ids,
      ])) as unknown as RowDataPacket[][];

      const IndividualAccounts: IIndividualAccount[] = [];

      (individual_accounts_result_query as IIndividualAccountDB[]).forEach(individualAccount => {
        IndividualAccounts.push(parseIndividualAccountQueryResult(individualAccount));
      });

      return IndividualAccounts;
    } catch (err) {
      throw new DatabaseException('Failed to get individual accounts details');
    }
  }
}

const individualAccountRepository = new IndividualAccountRepository();
export default individualAccountRepository;
