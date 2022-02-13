import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import {
  IAccount,
  IBusinessAccount,
  IBusinessAccountDB,
  IIndividualAccountDB,
} from '../types/account.types.js';
import { parseBusinessAccountQueryResult } from '../utils/db.parser.js';
import AccountRepository from './account.repository.js';
import { createAddressPayload } from '../utils/db.parser.js';
import DatabaseException from '../exceptions/db.exception.js';
import addressRepository from './address.repository.js';
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

      const [bussiness_insertion] = (await sql_con.query(
        'INSERT INTO businessAccount SET ?',
        business_payload,
      )) as unknown as OkPacket[];

      return new_account_id;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }

  async getBusinessAccountByAccountID(account_id: string) {
    try {
      let query = `SELECT a.accountID, ba.companyID,ba.companyName,ba.context ,a.balance,s.statusName as status,c.currencyCode, co.countryName, ad.countryCode, ad.postalCode, ad.city, ad.region, ad.streetName, ad.streetNumber
                      FROM account AS a 
                      LEFT JOIN businessAccount AS ba 
                      LEFT JOIN statusAccount AS s 
                      LEFT JOIN currency AS c 
                      LEFT JOIN address AS ad
                      LEFT JOIN country AS co
                      ON c.currencyID=a.currencyID AND s.statusID=a.statusID AND a.accountID= ba.accountID AND ad.addressID=ba.addressID AND co.countryCode=ad.countryCode
                      WHERE a.accountID = ?`;
      const [account_query_result] = (await sql_con.query(query, [
        account_id,
      ])) as unknown as RowDataPacket[][];
console.log(account_query_result);
      return parseBusinessAccountQueryResult(account_query_result[0] as IBusinessAccountDB);
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }
}

const businessAccountRepository = new BusinessAccountRepository();
export default businessAccountRepository;
