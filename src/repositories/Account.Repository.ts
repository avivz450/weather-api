import { OkPacket, RowDataPacket } from "mysql2";
import { sql_con } from "../db/sql/sql.connection.js";
import DatabaseException from "../exceptions/db.exception.js";
import { IIndividualAccount, IAccount, AccountStatuses } from "../types/account.types.js";
import { IGeneralObj } from "../types/general.types.js";

class AccountRepository {
    async createAccount(payload: IAccount) {
        try {
            let query = 'SELECT currencyID FROM currency WHERE currencyCode = ?';
            //get currencyID with currency code
            const [currency_query_result] = (await sql_con.query(query,[payload.currency])) as unknown as RowDataPacket[][];
    
            // get statusID from statuses
            query = 'SELECT statusID FROM statusAccount WHERE statusName = ?'; 
            const [status_query_result] = (await sql_con.query(query, [AccountStatuses.active])) as unknown as RowDataPacket[][];
    
            //create row in account table
            const account_payload = {
                currencyID: (currency_query_result[0] as IGeneralObj).currencyID,
                balance: payload.balance || 0,
                statusID: (status_query_result[0] as IGeneralObj).statusID,
                agentID: payload.agentID
            };
    
            let insert_query = 'INSERT INTO account SET ?';
            const [account_insertion_result] = (await sql_con.query(
            insert_query,
            [account_payload],
            )) as unknown as OkPacket[];
            
            return account_insertion_result.insertId.toString();
        } catch (err) {
            throw new DatabaseException("Failed to create account")
        }
    }

    async getAccountByAccountId(account_id: string) {
        try {
            const query = "SELECT * FROM account WHERE accountID = ?"
            const [account_query] = (await sql_con.query(
                query,
                [account_id]
            )) as unknown as RowDataPacket[][];
    
            return account_query[0] as IIndividualAccount || null;
        } catch (err) {
            throw new DatabaseException("Failed to get account details")
        }
    }
  

    async changeAccountsStatusesByAccountIds(account_ids: string[], status_to_update: AccountStatuses) {  
        try {
            const in_placeholder = account_ids.map(() => "?").join(",")
            const query = `UPDATE account a JOIN statuses s ON (a.statusID = o.statusID)
                            SET a.statusID = o.statusID
                            WHERE a.accountID IN (${in_placeholder}) AND o.statusName = ?`
            const [update_query_result] = (await sql_con.query(
                query,
                [status_to_update]
            )) as unknown as OkPacket[];
            
            if (update_query_result.affectedRows) {
                return true;
            } else throw new Error("");
        } catch (err) {
            throw new DatabaseException(`Falied to change account statuses to account ids: ${account_ids.toString()}`);
        }
    }

}
const accountRepository = new AccountRepository();
export default accountRepository;
