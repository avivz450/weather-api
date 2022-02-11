import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import { IAccount, IBusinessAccount } from '../types/account.types.js';
import { parseBusinessAccountQueryResult } from '../utils/db.parser.js';
import AccountRepository from './Account.Repository.js';
import { createAddressPayload } from '../utils/db.parser.js';
import DatabaseException from '../exceptions/db.exception.js';
class BusinessAccountRepository {
   
  async createBusinessAccount(payload: Omit<IBusinessAccount, 'account_id'>) {
    try {
      const new_account_id = await AccountRepository.createAccount(payload as unknown as IAccount);
    
      // create row in address table
      const address_payload = createAddressPayload(payload);
      let insert_query = 'INSERT INTO address SET ?';
      const [address_insertion] = (await sql_con.query(
        insert_query,
        address_payload,
      )) as unknown as OkPacket[];
  
      // create row in bussinessAccount table
      const business_payload = {
        accountID: new_account_id,
        companyID: payload.company_id,
        companyName: payload.company_name,
        context: payload.context || null,
        addressID: address_insertion.insertId,
      };
  
      const [bussiness_insertion] = (await sql_con.query(
        'INSERT INTO businessAccount SET ?',
        business_payload,
      )) as unknown as OkPacket[];
  
      return new_account_id;
    } catch (err) {
        throw new DatabaseException("Failed to create business account")
    }
  }

  async getBusinessAccountByAccountID(account_id: string) {
    try {
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
    } catch (err) {
      throw new DatabaseException("Failed to get business account details")
    }
  }
}

const businessAccountRepository = new BusinessAccountRepository();
export default businessAccountRepository;
