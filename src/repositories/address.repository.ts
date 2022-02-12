import { OkPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';

class AddressRepository {
  async createAddress(payload:any) {
    try {
      //create row in address table
      let insert_query = 'INSERT INTO address SET ?';
      const [address_insertion] = (await sql_con.query(insert_query, [
        payload,
      ])) as unknown as OkPacket[];

      return address_insertion.insertId ? address_insertion.insertId : null;
    } catch (err) {
      const errMessasge: string = (err as any).sqlMessage;
      throw new DatabaseException(errMessasge);
    }
  }
}

const addressRepository = new AddressRepository();
export default addressRepository;
