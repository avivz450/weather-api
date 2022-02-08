export interface IAccount {
    account_id: number;
    currency: number;
    balance?: number;
    status?: AccountStatuses;
}

export enum AccountStatuses {
    notActive,
    active,
}

export interface IIndividualAccount extends IAccount {
    individual_id: number;
    first_name: string;
    last_name: string;
    email?: string;
    address?: IAddress;
}

export interface IBusinessAccount extends Account {
    account_id: number;
    company_id: string;
    company_name: string;
    context?: string;
    address?: IAddress;
}

type AccountDetails = [string, number];
export interface IFamilyAccount extends IAccount {
    individualAccountsDetails: AccountDetails[];
}

export interface IAddress {
    address_id: number;
    country_name: string;
    country_code: number;
    postal_code: number;
    city: string;
    region: string;
    street_name: string;
    street_number: number;
}

export interface ITransferRequest {
    sourceAccount: number;
    DestinationAccount: number;
    currency?: string;
    amount: number;
}

export interface ITransferResponse {
    sourceAccount: Partial<IAccount>;
    DestinationAccount: Partial<IAccount>;
}
