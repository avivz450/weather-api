import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { IAuthenticationQueryRes } from '../types/athentication.types.js';

class AuthenticationRepository {
  async getSecretKeyAndAgentIdByAccessKey(accesKey: string) {
    try {
      const query = `SELECT agentID, secretKey 
                            FROM agent
                            WHERE accessKey = ?`;
      const [secret_query_res] = (await sql_con.query(query, [accesKey])) as RowDataPacket[][];
      const { secretKey, agentID } = secret_query_res[0];

      return secretKey && agentID ? { secret_key: secretKey, agent_id: agentID } as IAuthenticationQueryRes : null;
    } catch (err) {
      throw new DatabaseException('Failed to authenticate request`');
    }
  }
}

const authenticationRepository = new AuthenticationRepository();
export default authenticationRepository;
