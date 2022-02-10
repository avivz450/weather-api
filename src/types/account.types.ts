export interface IAccount {
  account_id: string;
  currency: string;
  balance?: number;
  status?: AccountStatuses;
}
export enum AccountStatuses {
  notActive,
  active,
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
  context: string;
  owners: string[] | IIndividualAccount[];
}
export interface IFamilyAccountCreationInput extends IFamilyAccount {
  individual_accounts_details: IndividualTransferDetails[];
}

export interface IAddress {
  address_id: string;
  country_name: string;
  country_code: number;
  postal_code: number;
  city: string;
  region: string;
  street_name: string;
  street_number: number;
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

export enum DetailsLevel {
  full = 'full',
  short = 'short',
}
