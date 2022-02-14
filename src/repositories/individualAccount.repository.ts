import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { IIndividualAccount, IIndividualAccountDB, IAccount } from '../types/account.types';
import addressRepository from './address.repository.js';
import { createAddressPayload, parseIndividualAccountQueryResult } from '../utils/db.parser.js';
import accountRepository from './account.repository.js';

class IndividualAccountRepository {
  async createIndividualAccount(payload: Omit<IIndividualAccount, 'account_id'>) {
    // create an account
    const new_account_id = await accountRepository.createAccount(payload as unknown as IAccount);

    //create row in address table
    const address_payload = createAddressPayload(payload);
    const address_id = await addressRepository.createAddress(address_payload);

    try {
      //create row in individualAccount table
      const individual_payload = {
        accountID: new_account_id,
        individualID: payload.individual_id,
        firstName: payload.first_name,
        lastName: payload.last_name,
        email: payload.email || null,
        addressID: address_id,
      };

      let insert_query = 'INSERT INTO individualAccount SET ?';
      await sql_con.query(insert_query, [individual_payload]);

      return new_account_id;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
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
      const [account_query_result] = (await sql_con.query(query, [account_id])) as unknown as RowDataPacket[];

      return parseIndividualAccountQueryResult(account_query_result[0]);
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getIndividualAccountsByAccountIds(account_ids: string[]) {
    try {
      const query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName ,ad.*
                      FROM account AS a 
                      LEFT JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                      LEFT JOIN statusAccount AS s ON s.statusID=a.statusID
                      LEFT JOIN currency AS c ON c.currencyID=a.currencyID
                      LEFT JOIN address AS ad ON ad.addressID=ia.addressID
                      LEFT JOIN country as co ON co.countryCode=ad.countryCode
                      WHERE a.accountID IN (${'?,'.repeat(account_ids.length).slice(0, -1)})`;

      const [individual_accounts_result_query] = (await sql_con.query(query, [...account_ids])) as unknown as RowDataPacket[];

      const IndividualAccounts: IIndividualAccount[] = [];
      (individual_accounts_result_query as IIndividualAccountDB[]).forEach(individualAccount => {
        IndividualAccounts.push(parseIndividualAccountQueryResult(individualAccount));
      });

      return IndividualAccounts || null;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getIndividualAccountsByIndividualIds(individual_ids: string[]) {
    try {
      const query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName, ad.*
                      FROM account AS a 
                      LEFT JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                      LEFT JOIN statusAccount AS s ON s.statusID=a.statusID
                      LEFT JOIN currency AS c ON c.currencyID=a.currencyID
                      LEFT JOIN address AS ad ON ad.addressID=ia.addressID
                      LEFT JOIN country as co ON co.countryCode=ad.countryCode
                      WHERE ia.individualID IN (?)`;

      const [individual_accounts_result_query] = (await sql_con.query(query, [[...individual_ids]])) as unknown as RowDataPacket[][];

      const IndividualAccounts: IIndividualAccount[] = [];

      (individual_accounts_result_query as IIndividualAccountDB[]).forEach(individualAccount => {
        IndividualAccounts.push(parseIndividualAccountQueryResult(individualAccount));
      });

      return IndividualAccounts;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }
}

const individualAccountRepository = new IndividualAccountRepository();
export default individualAccountRepository;
