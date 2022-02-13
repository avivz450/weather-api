import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';

class AuthenticationRepository {
  async getSecretKey(accesKey: string) {
        try {
            const query = `SELECT secretKey 
                            FROM agent
                            WHERE accessKey = ?`
            const [secret_query_res] = (await sql_con.query(
                query,
                [accesKey]
            )) as RowDataPacket[][];
            const { secretKey } = secret_query_res[0];
            
            return secretKey ? secretKey : null;
        } catch (err) {
            throw new DatabaseException("Failed to authenticate request`");
        }
    }   
}

const authenticationRepository = new AuthenticationRepository();
export default authenticationRepository;
