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

        await sql_con.query(
            "INSERT INTO individualAccount SET ?",
            individual_payload
        );
        
        
        return this.getIndividualAccountByAccountId(account_insertion.insertId.toString());
    }

    async getIndividualAccountByAccountId(account_id: string) {
        const [account_model] = (await sql_con.query(
            `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email
            FROM account as a 
            join individualAccount as ia on a.accountID= ia.accountID 
            join statusAccount as s on s.statusID=a.statusID
            join currency as c on c.currencyID=a.currencyID
            WHERE a.accountID = ?`,
            account_id
        )) as unknown as RowDataPacket[];

        const [address_model] = (await sql_con.query(
            `SELECT ad.*
            FROM account as a 
            join individualAccount as ia 
            join address as ad 
            on a.accountID=ia.accountID and ad.addressID=ia.addressID
            WHERE a.accountID = ?`,
            account_id
        )) as unknown as RowDataPacket[];

        const resultModel = { ...account_model[0], address: address_model[0] };
        return resultModel as IIndividualAccount;
    }

    async getIndividualAccountsByAccountIds(account_ids: string[]) {
        const individuals_accounts: IIndividualAccount[] = [];
        account_ids.forEach(async account_id => {
            const [account_model] = (await sql_con.query(
                `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email
                FROM account AS a 
                JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                JOIN statusAccount AS s ON s.statusID=a.statusID
                JOIN currency AS c ON c.currencyID=a.currencyID
                WHERE ia.individualID = ?`,
                account_id
            )) as unknown as RowDataPacket[];
    
            const [address_model] = (await sql_con.query(
                `SELECT ad.*
                FROM account AS a 
                JOIN individualAccount as ia 
                JOIN address AS ad 
                ON a.accountID=ia.accountID AND ad.addressID=ia.addressID
                WHERE a.accountID = ?`,
                account_model[0].accountID
            )) as unknown as RowDataPacket[];
    
            individuals_accounts.push({ ...account_model[0], address: address_model[0] });
        })
        return individuals_accounts;
    }

    async getIndividualAccountsByIndividualIds(individual_ids: string[]) {
        const individuals_accounts: IIndividualAccount[] = [];
        individual_ids.forEach(async individual_id => {
            const [account_model] = (await sql_con.query(
                `SELECT a.accountID, c.currencyCode, a.balance, s.statusName, ia.individualID, ia.firstName, ia.lastName, ia.email
                FROM account AS a 
                JOIN individualAccount AS ia ON a.accountID= ia.accountID 
                JOIN statusAccount AS s ON s.statusID=a.statusID
                JOIN currency AS c ON c.currencyID=a.currencyID
                WHERE ia.individualID = ?`,
                individual_id
            )) as unknown as RowDataPacket[];
    
            const [address_model] = (await sql_con.query(
                `SELECT ad.*
                FROM account AS a 
                JOIN individualAccount as ia 
                JOIN address AS ad 
                ON a.accountID=ia.accountID AND ad.addressID=ia.addressID
                WHERE a.accountID = ?`,
                account_model[0].accountID
            )) as unknown as RowDataPacket[];
    
            individuals_accounts.push({ ...account_model[0], address: address_model[0] });
        })
        return individuals_accounts;
    }
}

const individualAccountRepository = new IndividualAccountRepository();
export default individualAccountRepository;
