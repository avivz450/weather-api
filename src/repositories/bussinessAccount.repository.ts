import { OkPacket, RowDataPacket } from "mysql2";
import { sql_con } from "../db/sql/sql.connection.js";
import { IBusinessAccount } from "../types/account.types.js";

class BussinessAccountRepository {
    
    async createBusinessAccount(payload: Omit<IBusinessAccount, "accountID">) {
        //get currencyID with currency name
        const [currencyQuery] = (await sql_con.query(
            "SELECT currencyID FROM currency WHERE currencyCode = ?",
            [payload.currency]
        ) as unknown as RowDataPacket[]);

        // get statusID from statuses
        const [statusQuery] = (await sql_con.query(
            "SELECT statusID FROM statusAccount WHERE statusName = ?",
            ['active']
        ) as unknown as RowDataPacket[]);

        //create row in account table
        const accountPayload = {
            currencyID: currencyQuery[0].currencyID,
            balance: payload.balance || 0,
            statusID: statusQuery[0].statusID,
        }

        const [accountInsertion] = (await sql_con.query(
            "INSERT INTO account SET ?",
            accountPayload
        ) as unknown as [OkPacket]);
        
        //create row in address table
        const addressPayload = {
            countryCode: payload.address?.country_code || null,
            postalCode: payload.address?.postal_code || null,
            city: payload.address?.city || null,
            region: payload.address?.region || null,
            streetName: payload.address?.street_name || null,
            streetNumber: payload.address?.street_number || null
        }
        
        const [addressInsertion] = (await sql_con.query(
            "INSERT INTO address SET ?",
            addressPayload
        ) as unknown as OkPacket[]);

        //create row in bussinessAccount table
        const bussinessPayload = {
            accountID: accountInsertion.insertId,
            companyID: payload.company_id,
            companyName: payload.company_name,
            context: payload.context || null,
            addressID: addressInsertion.insertId
        }

        const [bussinessInsertion] = (await sql_con.query(
            "INSERT INTO businessAccount SET ?",
            bussinessPayload
        ) as unknown as OkPacket[]);
        
        return await this.getBusinessAccountByAccountID(accountInsertion.insertId.toString())
        
    }


    async getBusinessAccountByAccountID(account_id:string){
        const [accountModel] = (await sql_con.query( `SELECT a.accountID, ba.companyID,ba.companyName,ba.context ,a.balance,s.statusName as status,c.currencyCode
        FROM account as a join businessAccount as ba on a.accountID= ba.accountID 
        join statusAccount as s on s.statusID=a.statusID
        join currency as c on c.currencyID=a.currencyID
        WHERE a.accountID = ?`,account_id ) as unknown as RowDataPacket[]);

        const [addressModel] = (await sql_con.query( `SELECT ad.*
        FROM account as a join businessAccount as ba on a.accountID= ba.accountID 
        join address as ad on ad.addressID= ba.addressID
        WHERE a.accountID = ?`,account_id ) as unknown as RowDataPacket[]);
 
        const resultModel = {...accountModel[0],"address":addressModel[0]};
        return resultModel;
    }


}

const bussinessAccountRepository = new BussinessAccountRepository();

export default bussinessAccountRepository;