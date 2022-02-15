import { RowDataPacket } from 'mysql2';
import { IIndividualAccountDB } from './account.types.js';

export interface IFamilyAccountParse {
  query_res: RowDataPacket[] | IIndividualAccountDB[];
  owners_full?: IIndividualAccountDB[];
}
