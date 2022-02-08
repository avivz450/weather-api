import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import { IIndividualAccount } from '../types/account.types';
import { IGeneralObj } from '../types/general.types.js';

class IndividualAccountRepository {
  async createIndividualAccount(payload: Partial<IIndividualAccount>) {
    //get currencyID with currency code
    const [currency_query] = (await sql_con.query(
      'SELECT currencyID FROM currency WHERE currencyCode = ?',
      [payload.currency],
    )) as unknown as RowDataPacket[];

    // get statusID from statuses
    const [status_query] = (await sql_con.query(
      'SELECT statusID FROM statusAccount WHERE statusName = ?',
      ['active'],
    )) as unknown as RowDataPacket[];

    //create row in account table
    const account_payload = {
      currencyID: (currency_query[0] as IGeneralObj).currencyID,
      balance: payload.balance || 0,
      statusID: (status_query[0] as IGeneralObj).statusID,
    };

    const [account_insertion] = (await sql_con.query(
      'INSERT INTO account SET ?',
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

    const [address_insertion] = (await sql_con.query(
      'INSERT INTO address SET ?',
      address_payload,
    )) as unknown as OkPacket[];

    //create row in individualAccount table
    const individual_payload = {
      accountID: account_insertion.insertId,
      individualID: payload.individual_id,
      firstName: payload.first_name,
      lastName: payload.last_name,
      email: payload.email || null,
      addressID: address_insertion.insertId,
    };

    await sql_con.query('INSERT INTO individualAccount SET ?', individual_payload);

    return account_insertion.insertId;
  }

  async getIndividualAccountByAccountId(account_id: string) {
    const [account_query] = (await sql_con.query(
      'SELECT * FROM individualAccount WHERE accountID = ?',
      [account_id],
    )) as unknown as RowDataPacket[];

    return account_query[0] as IIndividualAccount;
  }

  async getIndividualAccountByIndividualId(individual_id: string) {
    const [account_query] = (await sql_con.query(
      'SELECT * FROM individualAccount WHERE individualID = ?',
      [individual_id],
    )) as unknown as RowDataPacket[];

    return account_query[0] as IIndividualAccount;
  }
}

const individualAccountRepository = new IndividualAccountRepository();
export default individualAccountRepository;
