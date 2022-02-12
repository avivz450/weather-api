import { OkPacket, RowDataPacket } from "mysql2";
import { sql_con } from "../db/sql/sql.connection.js";
import DatabaseException from "../exceptions/db.exception.js";
import { IAccount, IFamilyAccountCreationInput, IndividualTransferDetails, DetailsLevel } from "../types/account.types.js";
import { IFamilyAccountParse } from "../types/db.types.js";
import { parseFamilyAccountQueryResult } from "../utils/db.parser.js";
import AccountRepository from "./Account.Repository.js";
import individualAccountRepository from "./individualAccount.repository.js";

class FamilyAccountRepository {

    async createFamilyAccount(payload :Omit<IFamilyAccountCreationInput, "account_id">) {
        try {
            //insert new account row
            const new_account_id = await AccountRepository.createAccount(payload as unknown as IAccount);

            //insert new family account row with new account id
            const family_account_payload = {
                accountID: new_account_id,
                context: payload.context || null
            };

            let insert_query = 'INSERT INTO familyAccount SET ?';
            const [account_insertion_result] = (await sql_con.query(
            insert_query,
            [family_account_payload]
            )) as unknown as OkPacket[][];
            
            return account_insertion_result.insertId.toString();
        } catch (err) {
            throw new DatabaseException("Failed to create family account");
        }
    }

    async getFamilyAccount(family_account_id: string, details_level: DetailsLevel) {
        try {
            if (details_level === DetailsLevel.short ) {
                //get family account return after parse
                let query = `SELECT a.accountID, c.currencyCode, s.statusName, a.balance, fa.context, ow.individualAccountID
                            FROM account AS a 
                            JOIN familyAccount AS fa 
                            JOIN ownersFamilyAccount ow
                            JOIN statusAccount AS s 
                            JOIN currency AS c 
                            ON a.accountID= fa.accountID AND ow.familyAccountID=fa.accountID AND s.statusID=a.statusID AND c.currencyID=a.currencyID 
                            WHERE a.accountID = ?`
                const [account_query_result] = (await sql_con.query(
                query,
                [family_account_id]
                )) as unknown as RowDataPacket[][];

                const payload = {
                    query_res: account_query_result,
                } as IFamilyAccountParse;
    
                return parseFamilyAccountQueryResult(payload, details_level);
            
            } else if (details_level === DetailsLevel.full) {
                let query = `SELECT a.accountID, c.currencyCode, s.statusName, a.balance, fa.context, ow.individualAccountID
                            FROM account AS a 
                            JOIN familyAccount AS fa 
                            JOIN ownersFamilyAccount ow
                            JOIN statusAccount AS s 
                            JOIN currency AS c 
                            ON a.accountID= fa.accountID AND ow.familyAccountID=fa.accountID AND s.statusID=a.statusID AND c.currencyID=a.currencyID 
                            WHERE a.accountID = ?`
                const [account_query_result] = (await sql_con.query(
                query,
                [family_account_id]
                )) as unknown as RowDataPacket[][];
                
                const owners: string[] = [];
                account_query_result.forEach(row => {
                    const { individualAccountID } = row;
                    owners.push(individualAccountID);
                });

                const owners_full = await individualAccountRepository.getIndividualAccountsByIndividualIds(owners);
                const payload = {
                    query_res: account_query_result,
                    owners_full
                } as IFamilyAccountParse;
                
                return parseFamilyAccountQueryResult(payload, details_level);
            }
            
        } catch (err) {
          throw new DatabaseException(`Failed to get family account with id: ${family_account_id}`)
        }
    }

    async addIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_ids: string[]) {
        try{
            //Added each individual account id to ownersFamilyAccount
            let placeholder = individual_accounts_ids.map(() => "(?, ?)").join(",");
            let insert_query =`INSERT INTO familyAccount
                                (familyAccountID, individualAccountID)
                                VALUES ${placeholder}`;
            
            let values: string[] = [];
            individual_accounts_ids.forEach(individual_account_id => {
                values.push(family_account_id);
                values.push(individual_account_id);
            });
            
            const [account_insertion_result] = (await sql_con.query(
            insert_query,
            [...values]
            )) as unknown as OkPacket[];
            
            if (account_insertion_result.insertId) {
                return true;
            } else throw Error("");

        } catch(err) {
            throw new DatabaseException("Failed to add individual accounts to a family account")
        }
    }

    async transferFromIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_transfer_details: IndividualTransferDetails[]) {
        try {
            //iterate over tuples -> calc amount to add to family 
            const total_transfer_amount = individual_accounts_transfer_details.reduce((total_amount, individual_account_details) => {
                total_amount += individual_account_details[1];
                return total_amount;
            }, 0)
            //subtract from each account his amount
            let individual_account_when_placeholder = individual_accounts_transfer_details.map(() => "WHEN accountID = ? THEN balance-?").join("\n\t\t\t\t\t\t\t\t ");
            individual_accounts_transfer_details.push(['8', total_transfer_amount]) //push family account id and total amount to add to balance
            let values_placeholder = individual_accounts_transfer_details.map(() => "?").join(",");
            let insert_query = `UPDATE account SET balance = (
                                CASE ${individual_account_when_placeholder}
                                WHEN accountID = ? THEN balance+?
                                END)
                                WHERE accountID in (${values_placeholder})`;
            
            let values: (string | number)[] = [];
            individual_accounts_transfer_details.forEach(individual_transfer_details => {
                values.push(individual_transfer_details[0]); //push individual account id
                values.push(individual_transfer_details[1]); //push its amount to subtract
            });
            individual_accounts_transfer_details.forEach(individual_transfer_details => {
                values.push(individual_transfer_details[0]); //push again individual account ids for where clause
            });
            values.push(family_account_id); //push also family account id for where clause
            
            const [account_insertion_result] = (await sql_con.query(
            insert_query,
            [...values]
            )) as unknown as OkPacket[];
    
            if (account_insertion_result.affectedRows) {
                return true;
            } else throw Error("");
        } catch(err) {
            throw new DatabaseException("Failed to transfer from individuals to family account")
        }
    }

    async removeIndividualAccountsFromFamilyAccount(family_account_id: string, individual_accounts_ids: string[]) {
        try{
            let in_placeholder = individual_accounts_ids.map(() => "?").join(",");
            let insert_query =`DELETE FROM ownersFamilyAccount
                               WHERE individualAccountID IN (${in_placeholder})`;
            
            const [account_deletion_result] = (await sql_con.query(
            insert_query,
            [...individual_accounts_ids]
            )) as unknown as OkPacket[];

            if (account_deletion_result.affectedRows) {
                return true;
            } else throw Error("");
        } catch(err) {
            throw new DatabaseException("Failed to add individual accounts to a family account")
        }
    }

    async transferFromFamilyAccountToIndividualAccounts(family_account_id: string, individual_accounts_transfer_details: IndividualTransferDetails[]) {
        try {
            //iterate over tuples -> calc amount to subtract from family 
            const total_transfer_amount = individual_accounts_transfer_details.reduce((total_amount, individual_account_details) => {
                total_amount += individual_account_details[1];
                return total_amount;
            }, 0)
            //subtract from family account the total amount and add to each individual his amount
            let individual_account_when_placeholder = individual_accounts_transfer_details.map(() => "WHEN accountID = ? THEN balance+?").join("\n\t\t\t\t\t\t\t\t ");
            individual_accounts_transfer_details.push(['8', total_transfer_amount]) //push family account id and total amount to subtract to balance
            let values_placeholder = individual_accounts_transfer_details.map(() => "?").join(",");
            let insert_query = `UPDATE account SET balance = (
                                CASE ${individual_account_when_placeholder}
                                WHEN accountID = ? THEN balance-?
                                END)
                                WHERE accountID in (${values_placeholder})`;
            
            let values: (string | number)[] = [];
            individual_accounts_transfer_details.forEach(individual_transfer_details => {
                values.push(individual_transfer_details[0]); //push individual account id
                values.push(individual_transfer_details[1]); //push its amount to add
            });
            individual_accounts_transfer_details.forEach(individual_transfer_details => {
                values.push(individual_transfer_details[0]); //push again individual account ids for where clause
            });
            values.push(family_account_id); //push also family account id for where clause
            
            const [account_update_result] = (await sql_con.query(
            insert_query,
            [...values]
            )) as unknown as OkPacket[];
    
            if (account_update_result.affectedRows) {
                return true;
            } else throw Error("");
        } catch(err) {
            throw new DatabaseException("Failed to transfer from individuals to family account")
        }
    }

    async getOwnersByFamilyAccountId(family_account_id: string) {
        //return all account owners ids in array
        try {
            let query = `SELECT individualAccountID
                        FROM account a
                        JOIN ownersFamilyAccount o
                        ON a.accountID=o.familyAccountID
                        WHERE o.familyAccountID = ?`
            const [get_owners_query_result] = (await sql_con.query(
            query,
            [family_account_id]
            )) as unknown as RowDataPacket[][];
            
            // parse to array of string ids
            return get_owners_query_result.map(owner_id => {
                return owner_id.individualAccountID as string
            });
        } catch (err) {
            throw new DatabaseException(`Failed to get owners of family account id: ${family_account_id}`)
        }
    }

    closeFamilyAccountByAccountId(family_account_id: string) {
    }
}

const familyAccountRepository = new FamilyAccountRepository();
export default familyAccountRepository;
