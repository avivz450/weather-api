import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import { IBusinessAccount, ITransferRequest, ITransferResponse } from '../types/account.types.js';
import accountRepository from './account.repository.js';
import { IGeneralObj } from '../types/general.types.js';
import DatabaseException from '../exceptions/db.exception.js';

class TransferRepository {
  async transfer(payload: ITransferRequest, rate: number) {
    try {
      const source_account = await accountRepository.getAccountByAccountId(payload.source_account_id);
      const destination_account = await accountRepository.getAccountByAccountId(
        payload.destination_account_id,
      );

      if (source_account.balance && destination_account.balance) {
        const updated_source_account_balance = source_account.balance - payload.amount;
        const updated_destination_account_balance =
          destination_account.balance + payload.amount * rate;

        let query = `UPDATE account SET balance = (
                            CASE WHEN accountID = ? THEN ?
                                 WHEN accountID = ? THEN ?
                            END)
                            WHERE accountID in (?, ?)`;
        const [transfer_update] = (await sql_con.query(query, [
          payload.source_account_id,
          updated_source_account_balance,
          payload.destination_account_id,
          updated_destination_account_balance,
          payload.destination_account_id,
          payload.destination_account_id,
        ])) as unknown as OkPacket[];

        source_account.balance = updated_source_account_balance;
        destination_account.balance = updated_destination_account_balance;

        const transaction_payload = {
          sourceAccountID: payload.source_account_id,
          destinationAccountID: payload.destination_account_id,
          sourceCurrencyID: (source_account as any).currencyID,
          destinationCurrencyID: (destination_account as any).currencyID,
          amount: payload.amount,
          // date: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        query = 'INSERT INTO address SET ?';
        const [transaction_insertion] = (await sql_con.query(
          query,
          transaction_payload,
        )) as unknown as OkPacket[];

        const transfer_response = {
          source_account: {
            account_id: (source_account as unknown as IGeneralObj).accountID,
            currency_id: (source_account as unknown as IGeneralObj).currencyID,
            balance: source_account.balance,
          },
          destination_account: {
            account_id: (destination_account as unknown as IGeneralObj).accountID,
            currency_id: (destination_account as unknown as IGeneralObj).currencyID,
            balance: destination_account.balance,
          },
        };

        return transfer_response as ITransferResponse;
      }
    } catch (err) {
      throw new DatabaseException('Failed to make a transfer');
    }
  }
}

const transferRepository = new TransferRepository();
export default transferRepository;
