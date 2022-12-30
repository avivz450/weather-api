import logger from "@ajar/marker";
import {BooleanUtility} from "../utils/boolean-utility.js";
import {EmailUtility} from "../utils/email-utility.js";

export class Account {
    id: string = "";
    name: string = "";
    email: string = "";
    is_active: boolean = true;
    is_deleted: boolean = true;
    created_at: number = 0;
    updated_at: number = 0;
    updateable_fields: string[] = ["name"];

    constructor(account?: Account) {
        if (account) {
            this.id = account.id || "";
            this.name = account.name || "";
            this.email = account.email || "";
            this.is_active = account.is_active || true;
            this.is_deleted = account.is_deleted || false;
            this.created_at = account.created_at || 0;
            this.updated_at = account.updated_at || 0;
        }
    }

    static parseObjectFromRequest(correlation_id: string, req: any): Account {
        const method_name = "Account/parseFromObjectOrRequest";
        logger.info(correlation_id, `${method_name} - start`);

        let account = new Account();

        account.name = req.body["name"] || "";
        account.email = req.body["email"] || "";
        account.id = req.params["id"] || "";

        return account;
    }

    static parseObjectFromDb(correlation_id: string, data: any): Account {
        logger.verbose(correlation_id, `Account/parseObjectFromDb - input: `, data);
        let account = new Account();

        if (data) {
            account.id = data["account_id"] || "";
            account.name = data["account_name"] || "";
            account.email = data["account_email"] || "";
            account.is_active = data["account_is_active"] ? BooleanUtility.parseToBoolean(correlation_id, data["account_is_active"]) : true;
            account.is_deleted = data["account_is_deleted"] ? BooleanUtility.parseToBoolean(correlation_id, data["account_is_deleted"]) : false;
            account.created_at = data["account_created_at"] ? Number(data["account_created_at"]) : 0;
            account.updated_at = data["account_updated_at"] ? Number(data["account_updated_at"]) : 0;
        }
        logger.verbose(correlation_id, `Account/parseObjectFromDb - output: `, account);
        return account;
    }

    static parseListFromDB(correlation_id: string, data_array: Array<object>): Array<Account> {
        logger.verbose(correlation_id, `Account/parseListFromDB - input: `, data_array);
        let accounts: Array<Account> = [];

        if (data_array && data_array.length > 0) {
            data_array.forEach((item) => {
                logger.verbose(correlation_id, `Account/parseListFromDB - calling Account/parseObjectFromDb`);
                accounts.push(Account.parseObjectFromDb(correlation_id, item));
            });
        }
        logger.verbose(correlation_id, `Account/parseListFromDB - output: `, accounts);
        return accounts;
    }

    static parseObjectToResponse(correlation_id: string, data: Account): object | null {
        logger.verbose(correlation_id, `Account/parseObjectToResponse - input: `, data);
        if (!data) {
            logger.verbose(correlation_id, `Account/parseObjectToResponse - output: `, null);
            return null;
        } else {
            let result = {
                id: data.id || "",
                name: data.name || "",
                email: data.email || "",
                is_active: data.is_active || true,
                is_deleted: data.is_deleted || false,
                created_at: data.created_at || 0,
                updated_at: data.updated_at || 0
            };
            logger.verbose(correlation_id, `Account/parseObjectToResponse - output: `, result);
            return result;
        }
    }

    static parseListToResponse(correlation_id: string, data_array: Array<Account>): Array<object | null> {
        logger.verbose(correlation_id, `Account/parseListToResponse - input: `, data_array);
        let accounts: Array<object | null>= [];

        if (data_array && data_array.length > 0) {
            data_array.forEach((item) => {
                logger.verbose(correlation_id, `Account/parseListToResponse - calling Account/parseObjectToResponse`);
                accounts.push(Account.parseObjectToResponse(correlation_id, item));
            });
        }
        logger.verbose(correlation_id, `Account/parseListToResponse - output: `, accounts);
        return accounts;
    }

    static parseDeletedObjectFromDb(correlation_id: string, data: any): object | null {
        logger.verbose(correlation_id, `Account/parseDeletedObjectFromDb - input: `, data);
        if (data) {
            let result = {
                id: data["account_id"] || "",
                is_deleted: data["account_is_deleted"] ? BooleanUtility.parseToBoolean(correlation_id, data["account_is_deleted"]) : false
            };
            logger.verbose(correlation_id, `Account/parseDeletedObjectFromDb - output: `, result);
            return result;
        } else {
            logger.verbose(correlation_id, `Account/parseDeletedObjectFromDb - output: `, null);
            return null;
        }
    }

    static parseDeletedObjectToResponse(correlation_id: string, data: any): object | null {
        logger.verbose(correlation_id, `Account/parseDeletedObjectToResponse - input: `, data);
        if (data) {
            let result = {
                deleted: data["is_deleted"] || false,
                // The token should be returned as the object ID
                id: data["id"] || ""
            };
            logger.verbose(correlation_id, `Account/parseDeletedObjectToResponse - output: `, result);
            return result;
        } else {
            logger.verbose(correlation_id, `Account/parseDeletedObjectToResponse - output: `, null);
            return null;
        }
    }

    static validateTypes(correlation_id: string, data: any){
        const method_name = "Account/validateTypes";
        logger.info(correlation_id, `${method_name} - start`);
        logger.verbose(correlation_id, `${method_name} - input`, data);

        try {
            if (data["id"] && typeof data["id"] !== "string") {
                throw new Error("INVALID_ID_TYPE");
            }
            if (data["name"] && typeof data["id"] !== "string") {
                throw new Error("INVALID_NAME_TYPE");
            }
            if (data["email"] && typeof data["id"] !== "string") {
                throw new Error("INVALID_EMAIL_TYPE");
            }
            if (data["is_active"] && typeof data["id"] !== "boolean") {
                throw new Error("INVALID_IS_ACTIVE_TYPE");
            }
        }catch(err){
            logger.err(correlation_id, `${method_name} - error: `, err);
            throw err;
        }
    }

    validateAccount(correlation_id: string) {
        const method_name = "Account/validateAccount";
        logger.info(correlation_id, `${method_name} - start`);
        logger.verbose(correlation_id, `${method_name} - input parameters: Account-`, this);
        try{
            if(this.email && EmailUtility.isValidEmail(this.email) === false){
                throw new Error("INVALID_EMAIL")
            }
        }catch (err) {
            logger.err(correlation_id, `${method_name} - error: `, err);
            throw err;
        }
    }

    getUpdatetableObject(correlation_id: string) {
        const method_name = "Account/getUpdatetableObject";
        logger.info(correlation_id, `${method_name} - start`);
        logger.verbose(correlation_id, `${method_name} - input parameters: Account-`, this);
        const updatetable_object: {[key:string]:any}= {};

        for (const field in this) {
            if(this.updateable_fields.includes(field)){
                updatetable_object[field] = this[field];
            }
        }
        logger.verbose(correlation_id, `${method_name} - result: `, updatetable_object);
        return updatetable_object;
    }
}
