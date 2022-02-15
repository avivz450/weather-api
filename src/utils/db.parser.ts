import { RowDataPacket } from 'mysql2';
import {
  DetailsLevel,
  IAccount,
  IAddress,
  IBusinessAccount,
  IBusinessAccountDB,
  IFamilyAccount,
  IIndividualAccount,
  IIndividualAccountDB,
  IAccountDB,
  AccountStatuses,
  IFamilyAccountDB,
} from '../types/account.types.js';
import { IFamilyAccountParse } from '../types/db.types.js';
import { IGeneralObj } from '../types/general.types.js';

export function parseAccountQueryResult(query_result_obj: IAccountDB): IAccount {
  const { accountID, balance, currencyCode, currencyID, statusName, agentID } = query_result_obj;

  const parsed_response: IAccount = {
    account_id: accountID,
    balance,
    currency: currencyCode,
    status: statusName as AccountStatuses,
    agent_id: agentID,
  };
  const result = currencyID ? { ...parsed_response, currencyID } : parsed_response;
  return result;
}

export function parseAccountQueryResultForTransferResponse(query_result_obj: IAccountDB) {
  const { accountID, balance, currencyID, statusName, agentID } = query_result_obj;

  return {
    account_id: accountID,
    balance,
    currency: currencyID,
    status: statusName,
    agent_id: agentID,
  };
}

export function parseIndividualAccountQueryResult(query_result_obj: IIndividualAccountDB) {
  const { accountID, currencyCode, balance, statusName, individualID, firstName, lastName, email, addressID, countryCode, countryName, postalCode, city, region, streetName, streetNumber } =
    query_result_obj;

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


export function parseBusinessAccountsQueryResult(query_result: IBusinessAccountDB[]) {
  return (query_result as IBusinessAccountDB[]).map(business_account => {
    const { accountID, currencyCode, balance, statusName, companyID, companyName, context, addressID, countryCode, countryName, postalCode, city, region, streetName, streetNumber } = business_account;
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
  });
}

export function createAddressPayload(payload: Omit<IBusinessAccount, 'account_id'> | Omit<IIndividualAccount, 'account_id'>) {
  return {
    countryCode: payload.address?.country_code || null,
    postalCode: payload.address?.postal_code || null,
    city: payload.address?.city || null,
    region: payload.address?.region || null,
    streetName: payload.address?.street_name || null,
    streetNumber: payload.address?.street_number || null,
  };
}

export function parseFamilyAccountsQueryResult(payload: IFamilyAccountParse, details_level: DetailsLevel) {
  const temp_family_object: any = {};
  if (details_level === DetailsLevel.short) {
    let owners: string[] = [];
    (payload.query_res as IFamilyAccountDB[]).forEach(family_account => {
      const { accountID, currencyCode, statusName, balance, context, individualAccountID } = family_account;

      if (!temp_family_object[`${accountID}`]) {
        temp_family_object[`${accountID}`] = {} as IFamilyAccount;
        owners = [];
      }

      owners.push(String(individualAccountID));
      temp_family_object[`${accountID}`] = {
        account_id: accountID,
        currency: currencyCode,
        balance,
        status: statusName,
        context,
        owners,
      };
    });

    const parsed_family_object: IFamilyAccount[] = [];
    for (let family_account in temp_family_object) {
      parsed_family_object.push(temp_family_object[family_account]);
    }

    return parsed_family_object as IFamilyAccount[];
  } else if (details_level === DetailsLevel.full) {
    const temp_family_object: any = {};
    let owners: IIndividualAccount[] = [];

    (payload.query_res as IFamilyAccountDB[]).forEach((family_account, index) => {
      const { accountID, currencyCode, statusName, balance, context, individualAccountID } = family_account;
      if (!temp_family_object[`${accountID}`]) {
        temp_family_object[`${accountID}`] = {} as IFamilyAccount;
        owners = [];
      }

      const founded_owner = (payload.owners_full as unknown as IIndividualAccount[]).find(owner => owner.account_id.toString() === individualAccountID.toString());
      if (founded_owner) {
        owners.push(founded_owner);
      }

      temp_family_object[`${accountID}`] = {
        account_id: accountID,
        currency: currencyCode,
        balance,
        status: statusName,
        context,
        owners,
      };
    });

    const parsed_family_object: IFamilyAccount[] = [];
    for (let family_account in temp_family_object) {
      parsed_family_object.push(temp_family_object[family_account]);
    }

    return parsed_family_object as IFamilyAccount[];
  }
}
