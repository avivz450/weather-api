export interface IAccount {
  account_id: string;
  currency: string;
  balance?: number;
  status?: AccountStatuses;
}
export enum AccountStatuses {
  active = "not_active",
  not_active= "active",
}

export enum DetailsLevel {
  full = 'full',
  short = 'short',
}
export interface IIndividualAccount extends IAccount {
  individual_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  address?: Partial<IAddress>;
}
export interface IBusinessAccount extends IAccount {
  company_id: string;
  company_name: string;
  context?: string;
  address?: Partial<IAddress>;
}

export type IndividualTransferDetails = [string, number];

export interface IFamilyAccount extends IAccount {
  context: string,
  owners: string[] | IIndividualAccount[]
}
export interface IFamilyAccountCreationInput extends Omit<IFamilyAccount, "owners"> {
  individual_accounts_details: IndividualTransferDetails[];
}

export interface IAddress {
  address_id: string;
  country_name: string;
  country_code: string;
  postal_code: string;
  city: string;
  region: string;
  street_name: string;
  street_number: string;
}
export interface ITransferRequest {
    source_account: string;
    destination_account: string;
    amount: number;
}
export interface ITransferResponse {
  source_account: Partial<IAccount>;
  destination_account: Partial<IAccount>;
}

   
export interface IIndividualAccountDB {
  accountID: number,
  currencyCode: string,
  balance: number,
  statusName: string,
  individualID: number,
  firstName: string,
  lastName: number,
  email: string,
  addressID: number,
  countryName: string,
  countryCode: string,
  postalCode: number,
  city: string,
  region: string,
  streetName: string,
  streetNumber: string
}

export interface IBusinessAccountDB {
  accountID: number,
  currencyCode: string,
  balance: number,
  statusName: string,
  companyID: number;
  companyName: string;
  context?: string;
  addressID: number,
  countryName: string,
  countryCode: string,
  postalCode: number,
  city: string,
  region: string,
  streetName: string,
  streetNumber: string
}