import { RowDataPacket } from "mysql2";
import {IIndividualAccount} from './account.types.js';

export interface IFamilyAccountParse {
    [key: string]: RowDataPacket[] | IIndividualAccount[] 
}