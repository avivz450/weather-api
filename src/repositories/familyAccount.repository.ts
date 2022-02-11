    import { OkPacket, RowDataPacket } from "mysql2";
    import { sql_con } from "../db/sql/sql.connection.js";
    import { IFamilyAccount, IFamilyAccountCreationInput } from "../types/account.types.js";

    export class FamilyAccountRepository {

        createFamilyAccount(payload :Omit<IFamilyAccountCreationInput, "account_id">) {
            
        }

        // getFamilyAccount(family_account_id: string) {

        // }

        // addIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_id:string[]) {

        // }

        // transferFromIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_details: IndividualTransferDetails[]) {

        // }

        // removeIndividualAccountsToFamilyAccount(family_account_id: string, individual_accounts_id: string) {

        // }

        // transferFromFamilyAccountToIndividualAccounts(family_account_id: string,individual_accounts_details: IndividualTransferDetails[]) {

        // }

        // getOwnersByAccountId(account_id: string) {

        // }

        // closeFamilyAccount(account_id: string) {

        // }
    }

    const familyAccountRepository = new FamilyAccountRepository();
    export default familyAccountRepository;
