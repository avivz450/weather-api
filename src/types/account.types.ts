export interface IAccount {
    accountID: number;
    currency: number;
    balance?: number;
    status?: AccountStatuses;
}

export enum AccountStatuses {
    notActive,
    active,
}

export interface IIndividualAccount extends Account {
    individualID: number;
    firstName: string;
    lastName: string;
    email?: string;
    address?: IAddress;
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
