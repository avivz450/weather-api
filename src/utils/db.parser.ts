import { RowDataPacket } from "mysql2";
import { DetailsLevel, IAccount, IAddress, IBusinessAccount, IBusinessAccountDB, IFamilyAccount, IIndividualAccount, IIndividualAccountDB, IAccountDB, AccountStatuses } from "../types/account.types.js";
import { IFamilyAccountParse } from "../types/db.types.js";
import { IGeneralObj } from "../types/general.types.js";

export function parseAccountQueryResult(query_result_obj: IAccountDB):IAccount {
  const {
    accountID,
    balance,
    currencyCode,
    currencyID,
    statusName,
    agentID
  } = query_result_obj;

  const parsed_response: IAccount = {
    account_id: accountID,
    balance,
    currency: currencyCode,
    status: statusName as AccountStatuses,
    agent_id: agentID
  };
  const result = currencyID ?  {...parsed_response, currencyID} : parsed_response;
return result;
  

}

export function parseAccountQueryResultForTransferResponse(query_result_obj: IAccountDB) {
  const {
    accountID,
    balance,
    currencyID,
    statusName,
    agentID
  } = query_result_obj;

  return {
    account_id: accountID,
    balance,
    currency: currencyID,
    status: statusName,
    agent_id: agentID
  };
}


export function parseIndividualAccountQueryResult(query_result_obj: IIndividualAccountDB) {
  const {
    accountID,
    currencyCode,
    balance,
    statusName,
    individualID,
    firstName,
    lastName,
    email,
    addressID,
    countryCode,
    countryName,
    postalCode,
    city,
    region,
    streetName,
    streetNumber,
  } = query_result_obj;

  return {
    account_id: accountID,
    currency: currencyCode,
    balance,
    status: statusName,
    individual_id: individualID,
    first_name: firstName,
    last_name: lastName,
    email,
    address: {
      address_id: addressID,
      country_name: countryName,
      country_code: countryCode,
      postal_code: postalCode,
      city,
      region,
      street_name: streetName,
      street_number: streetNumber,
    },
  } as unknown as IIndividualAccount;
}

export function parseBusinessAccountQueryResult(query_result_obj: IBusinessAccountDB) {
  const {
    accountID,
    currencyCode,
    balance,
    statusName,
    companyID,
    companyName,
    context,
    addressID,
    countryCode,
    countryName,
    postalCode,
    city,
    region,
    streetName,
    streetNumber,
  } = query_result_obj;

  return {
    account_id: accountID,
    currency: currencyCode,
    balance,
    status: statusName,
    company_id: companyID,
    company_name: companyName,
    context,
    address: {
      address_id: addressID,
      country: countryCode,
      country_name: countryName,
      postal_code: postalCode,
      city,
      region,
      street_name: streetName,
      street_number: streetNumber,
    },
  } as unknown as IBusinessAccount;
}

export function createAddressPayload(payload: Omit<IBusinessAccount, "account_id"> | Omit<IIndividualAccount, "account_id"> ) {
    return {
        countryCode: payload.address?.country_code || null,
        postalCode: payload.address?.postal_code || null,
        city: payload.address?.city || null,
        region: payload.address?.region || null,
        streetName: payload.address?.street_name || null,
        streetNumber: payload.address?.street_number || null,
      };
}

export function parseFamilyAccountQueryResult(payload: IFamilyAccountParse, details_level: DetailsLevel) {
    if(details_level === DetailsLevel.short) {
        const { accountID, currencyCode, statusName, balance, context } = (payload.query_res as RowDataPacket[0]);
        const owners: string[] = [];
        const output = {
            account_id: accountID, 
            currency: currencyCode, 
            balance, 
            status: statusName, 
            context, 
            owners 
        };
        
        (payload.query_res as RowDataPacket[]).forEach(row => {
            const { individualAccountID } = row;
            output.owners.push(individualAccountID)
        });

        return output as IFamilyAccount;

    } else if (details_level === DetailsLevel.full) {
        const { accountID, currencyCode, statusName, balance, context } = (payload.query_res as RowDataPacket[])[0];
        const output = {
            account_id: accountID, 
            currency: currencyCode, 
            balance, 
            status: statusName, 
            context, 
            owners: payload.owners_full 
        };

        return output as IFamilyAccount;
    }
}
