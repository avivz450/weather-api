import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import { IAccount, IBusinessAccount, IBusinessAccountDB } from '../types/account.types.js';
import { parseBusinessAccountsQueryResult } from '../utils/db.parser.js';
import AccountRepository from './account.repository.js';
import { createAddressPayload } from '../utils/db.parser.js';
import DatabaseException from '../exceptions/db.exception.js';
import addressRepository from './address.repository.js';
import { IGeneralObj } from '../types/general.types.js';
class BusinessAccountRepository {
  async createBusinessAccount(payload: Omit<IBusinessAccount, 'account_id'>) {
    //create an account
    const new_account_id = await AccountRepository.createAccount(payload as unknown as IAccount);

    //create row in address table
    const address_payload = createAddressPayload(payload);
    const address_id = await addressRepository.createAddress(address_payload);

    try {
      // create row in bussinessAccount table
      const business_payload = {
        accountID: new_account_id,
        companyID: payload.company_id,
        companyName: payload.company_name,
        context: payload.context || null,
        addressID: address_id,
      };

      (await sql_con.query('INSERT INTO businessAccount SET ?', business_payload)) as unknown as OkPacket[];

      return new_account_id;
    } catch (err) {
      const errMessasge: string = (err as IGeneralObj).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getBusinessAccountsByAccountIds(account_ids: string[]) {
    try {
      let query = `SELECT a.accountID, ba.companyID,ba.companyName,ba.context ,a.balance,s.statusName as status,c.currencyCode, co.countryName, ad.countryCode, ad.postalCode, ad.city, ad.region, ad.streetName, ad.streetNumber
                  FROM account AS a 
                  LEFT JOIN businessAccount AS ba ON a.accountID= ba.accountID
                  LEFT JOIN statusAccount AS s ON s.statusID=a.statusID
                  LEFT JOIN currency AS c ON c.currencyID=a.currencyID
                  LEFT JOIN address AS ad ON ad.addressID=ba.addressID
                  LEFT JOIN country AS co ON co.countryCode=ad.countryCode
                  WHERE a.accountID IN (?)`;
      const [account_query_result] = (await sql_con.query(query, [account_ids])) as RowDataPacket[][];
      const business_accounts = parseBusinessAccountsQueryResult(account_query_result as IBusinessAccountDB[]);

      business_accounts.forEach(business_account => {
        if (business_account.company_id === null) {
          throw new Error(`business account with the id ${business_account.account_id} doesn't exists`);
        }
      });

      return business_accounts;
    } catch (err) {
      const errMessasge: string = (err as IGeneralObj).sqlMessage || (err as IGeneralObj).message;
      throw new DatabaseException(errMessasge);
    }
  }
}

const businessAccountRepository = new BusinessAccountRepository();
export default businessAccountRepository;
