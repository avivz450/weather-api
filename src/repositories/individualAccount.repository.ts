import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import { IIndividualAccount, IIndividualAccountDB } from '../types/account.types';
import { IGeneralObj } from '../types/general.types.js';
import { parseIndividualAccountQueryResult } from '../utils/db.parser.js';


class IndividualAccountRepository {
  async createIndividualAccount(payload: Partial<IIndividualAccount>) {
    let query = 'SELECT currencyID FROM currency WHERE currencyCode = ?';
    //get currencyID with currency code
    const [currency_query_result] = (await sql_con.query(query,[payload.currency])) as unknown as RowDataPacket[];

    // get statusID from statuses
    query = 'SELECT statusID FROM statusAccount WHERE statusName = ?'; 
    const [status_query_result] = (await sql_con.query(query, ['active'])) as unknown as RowDataPacket[];

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

    //create row in address table
    const address_payload = {
      countryCode: payload.address?.country_code || null,
      postalCode: payload.address?.postal_code || null,
      city: payload.address?.city || null,
      region: payload.address?.region || null,
      streetName: payload.address?.street_name || null,
      streetNumber: payload.address?.street_number || null,
    };

    insert_query = 'INSERT INTO address SET ?';
    const [address_insertion] = (await sql_con.query(
      insert_query,
      address_payload,
    )) as unknown as OkPacket[];

    //create row in individualAccount table
    const individual_payload = {
      accountID: account_insertion_result.insertId,
      individualID: payload.individual_id,
      firstName: payload.first_name,
      lastName: payload.last_name,
      email: payload.email || null,
      addressID: address_insertion.insertId,
    };

    insert_query = "INSERT INTO individualAccount SET ?";
    await sql_con.query(
      insert_query,
        individual_payload
    );
      return account_insertion_result.insertId.toString();
    }

    async getIndividualAccountByAccountId(account_id: string) {
      let  query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName ,ad.*
                    FROM account AS a 
                    JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                    JOIN statusAccount AS s ON s.statusID=a.statusID
                    JOIN currency AS c ON c.currencyID=a.currencyID
                    JOIN address AS ad ON ad.addressID=ia.addressID
                    JOIN country as co ON co.countryCode=ad.countryCode
                    WHERE a.accountID = ?`
        const [account_query_result] = (await sql_con.query(
            query,
            [account_id]
        )) as unknown as RowDataPacket[];

        return parseIndividualAccountQueryResult(account_query_result[0]);
    }

    async getIndividualAccountsByAccountIds(account_ids: string[]) {
      const query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName ,ad.*
                      FROM account AS a 
                      JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                      JOIN statusAccount AS s ON s.statusID=a.statusID
                      JOIN currency AS c ON c.currencyID=a.currencyID
                      JOIN address AS ad ON ad.addressID=ia.addressID
                      JOIN country as co ON co.countryCode=ad.countryCode
                      WHERE a.accountID IN (${'?,'.repeat(account_ids.length).slice(0,-1)})`
      
      const [individual_accounts_result_query] = (await sql_con.query(query, [...account_ids])) as unknown as RowDataPacket[];
      const IndividualAccounts: IIndividualAccount[] = [];
      (individual_accounts_result_query as IIndividualAccountDB[]).forEach(individualAccount => {
        IndividualAccounts.push(parseIndividualAccountQueryResult(individualAccount))
      })
      return IndividualAccounts;
    }

    async getIndividualAccountsByIndividualIds(individual_ids: string[]) {
      const query = `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email, co.countryName, ad.*
                    FROM account AS a 
                    JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                    JOIN statusAccount AS s ON s.statusID=a.statusID
                    JOIN currency AS c ON c.currencyID=a.currencyID
                    JOIN address AS ad ON ad.addressID=ia.addressID
                    JOIN country as co ON co.countryCode=ad.countryCode
                    WHERE ia.individualID IN (${'?,'.repeat(individual_ids.length).slice(0,-1)})`

      const [individual_accounts_result_query] = (await sql_con.query(query, [...individual_ids])) as unknown as RowDataPacket[];
      
      const IndividualAccounts: IIndividualAccount[] = [];
      
      (individual_accounts_result_query as IIndividualAccountDB[]).forEach(individualAccount => {
        IndividualAccounts.push(parseIndividualAccountQueryResult(individualAccount))
      })
      
      return IndividualAccounts;
    }
}

const individualAccountRepository = new IndividualAccountRepository();
export default individualAccountRepository;
