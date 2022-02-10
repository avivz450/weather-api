import { OkPacket, RowDataPacket } from "mysql2";
import { sql_con } from "../db/sql/sql.connection.js";
import { IBusinessAccount, ITransferRequest, ITransferResponse, IIndividualAccount } from "../types/account.types.js";
import bussinessAccountRepository from "./bussinessAccount.repository.js";

export class AccountRepository {
    async getAccountByAccountId(account_id: string) {
        const query = "SELECT * FROM account WHERE accountID = ?"
        const [account_query] = (await sql_con.query(
            query,
            [account_id]
        )) as unknown as RowDataPacket[];

        return account_query[0] as IIndividualAccount || null;
    }
}

const accountRepository = new AccountRepository();
export default accountRepository;
