export interface IAccount {
  account_id: string;
  currency: string;
  balance: number;
  status?: AccountStatuses;
  agent_id?: string;
  currencyID?: string;
}

export enum AccountTypes {
  Individual = 'Individual',
}

export enum AccountStatuses {
  active = 'active',
  inactive = 'inactive',
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