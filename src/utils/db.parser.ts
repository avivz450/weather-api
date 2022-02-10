import { IAddress, IBusinessAccount, IBusinessAccountDB, IIndividualAccount, IIndividualAccountDB } from "../types/account.types";
import { IGeneralObj } from "../types/general.types";

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
        streetNumber
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
            street_number: streetNumber
        } 
    } as unknown as IIndividualAccount
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
        streetNumber
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
            country:countryCode,
            country_name: countryName,
            postal_code: postalCode,
            city,
            region,
            street_name: streetName,
            street_number: streetNumber
        }
    } as unknown as IBusinessAccount
}