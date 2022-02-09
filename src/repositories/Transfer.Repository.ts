import { OkPacket, RowDataPacket } from "mysql2";
import { sql_con } from "../db/sql/sql.connection.js";
import { IBusinessAccount, ITransferRequest, ITransferResponse } from "../types/account.types.js";
import accountRepository from './Account.Repository.js';
import { IGeneralObj } from "../types/general.types.js";

export class TransferRepository {

    static async transfer(payload: ITransferRequest, rate: number) {

        const source_account = await accountRepository.getAccountByAccountId(payload.source_account);
        const destination_account = await accountRepository.getAccountByAccountId(payload.destination_account);
        
        if (source_account.balance && destination_account.balance) {

            const updated_source_account_balance = source_account.balance - payload.amount;
            const updated_destination_account_balance = destination_account.balance + (payload.amount*rate);

              const [ transfer_update ] = (await sql_con.query(
                `UPDATE account SET balance = (
                    CASE WHEN accountID = ? THEN ?
                         WHEN accountID = ? THEN ?
                    END)
                    WHERE accountID in (?, ?)`,
                [payload.source_account, updated_source_account_balance, payload.destination_account, updated_destination_account_balance, payload.destination_account, payload.destination_account]
            )) as unknown as OkPacket[];
            
            source_account.balance = updated_source_account_balance;
            destination_account.balance = updated_destination_account_balance;

            const transaction_payload = {
                sourceAccountID: payload.source_account,
                destinationAccountID: payload.destination_account,
                sourceCurrencyID: (source_account as any).currencyID,
                destinationCurrencyID: (destination_account as any).currencyID,
                amount: payload.amount,
                // date: new Date().toISOString().slice(0, 19).replace('T', ' ')
            }

            const [transaction_insertion] = (await sql_con.query(
                "INSERT INTO address SET ?",
                transaction_payload
            )) as unknown as OkPacket[];

            const transfer_response = {
                source_account: {
                    account_id: (source_account as unknown as IGeneralObj).accountID,
                    currency_id: (source_account as  unknown as IGeneralObj).currencyID,
                    balance: source_account.balance
                },
                destination_account: {
                    account_id: (destination_account as unknown as IGeneralObj).accountID,
                    currency_id: (destination_account as unknown as IGeneralObj).currencyID,
                    balance: destination_account.balance
                }
            }
            
            return transfer_response as ITransferResponse;
        }

        return null;
    }
}

const transferRepository = new TransferRepository();
export default transferRepository;
