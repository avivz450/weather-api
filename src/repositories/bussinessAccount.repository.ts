import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import { IBusinessAccount } from '../types/account.types.js';
import { parseBusinessAccountQueryResult } from '../utils/db.parser.js';

export class BussinessAccountRepository {
  static async createBusinessAccount(payload: Omit<IBusinessAccount, 'account_id'>) {
    // get currencyID with currency name
    let query = 'SELECT currencyID FROM currency WHERE currencyCode = ?'
    const [currency_query_result] = (await sql_con.query(
      query,
      [payload.currency],
    )) as unknown as RowDataPacket[];

    // get statusID from statuses
    query = 'SELECT statusID FROM statusAccount WHERE statusName = ?';
    const [status_query_result] = (await sql_con.query(
      query,
      ['active'],
    )) as unknown as RowDataPacket[];

    // create row in account table
    const account_payload = {
      currencyID: currency_query_result[0].currencyID,
      balance: payload.balance || 0,
      statusID: status_query_result[0].statusID,
    };

    let insert_query = 'INSERT INTO account SET ?';
    const [account_insertion] = (await sql_con.query(
      insert_query,
      account_payload,
    )) as unknown as [OkPacket];

    // create row in address table
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

    // create row in bussinessAccount table
    const business_payload = {
      accountID: account_insertion.insertId,
      companyID: payload.company_id,
      companyName: payload.company_name,
      context: payload.context || null,
      addressID: address_insertion.insertId,
    };

    const [bussiness_insertion] = (await sql_con.query(
      'INSERT INTO businessAccount SET ?',
      business_payload,
    )) as unknown as OkPacket[];

    return bussiness_insertion.insertId.toString();
  }

  async getBusinessAccountByAccountID(account_id: string) {
    let query = `SELECT a.accountID, ba.companyID,ba.companyName,ba.context ,a.balance,s.statusName as status,c.currencyCode, co.countryName, ad.*
                FROM account AS a 
                JOIN businessAccount AS ba 
                JOIN statusAccount AS s 
                JOIN currency AS c 
                JOIN address AS ad
                JOIN country AS co
                ON c.currencyID=a.currencyID AND s.statusID=a.statusID AND a.accountID= ba.accountID AND ad.addressID=ba.addressID AND co.countryCode=ad.countryCode
                WHERE a.accountID = ?`
    const [account_query_result] = (await sql_con.query(
      query,
      [account_id]
    )) as unknown as RowDataPacket[];
    
    return parseBusinessAccountQueryResult(account_query_result[0]);
  }
}

const businessAccountRepository = new BussinessAccountRepository();
export default businessAccountRepository;
