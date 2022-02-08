export interface IAccount {
  account_id: number;
  currency: string;
  balance?: number;
  status?: AccountStatuses;
}

export enum AccountStatuses {
  notActive,
  active,
}

export interface IIndividualAccount extends IAccount {
  account_id: number;
  individual_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  address?: Partial<IAddress>;
}

export interface IBusinessAccount extends IAccount {
  account_id: number;
  company_id: string;
  company_name: string;
  context?: string;
  address?: Partial<IAddress>;
}

export type AccountDetails = [string, number];
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
  source_account: number;
  destination_account: number;
  currency?: string;
  amount: number;
}

export interface ITransferResponse {
  source_account: Partial<IAccount>;
  destination_account: Partial<IAccount>;
}
