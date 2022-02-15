import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { IIdempotencyRequest, IIdempotencyResponse } from '../types/idempotency.types.js';

class IdempotencyRepository {
  async getResponseByIdempotencyKey(idempotency_request: IIdempotencyRequest): Promise<IIdempotencyResponse | null> {
        try {
            const { agent_id, idempotency_key } = idempotency_request;
            const query = `SELECT data 
                            FROM agent
                            WHERE agent_id = ? AND idempotency_key = ?`
            const [idempotency_query_res] = (await sql_con.query(
                query,
                [agent_id, idempotency_key]
            )) as RowDataPacket[][];
            const { data } = idempotency_query_res[0];
            
            return data ? { data } as IIdempotencyResponse : null;
        } catch (err) {
            throw new DatabaseException("Failed to validate idempotency request`");
        }
    }   

    async insertResponseData(idempotency_request: IIdempotencyRequest): Promise<boolean | null> {
        try {
            const { agent_id, idempotency_key, body } = idempotency_request;
            const query = `INSERT INTO idempotency 
                            (agentID, idempontency_key, data) 
                            VALUES(?, ? ,?)`
            const [idempotency_insertion] = (await sql_con.query(
                query,
                [agent_id, idempotency_key, body]
            )) as OkPacket[];
            
            return idempotency_insertion.insertId ? true : null;
        } catch (err) {
            throw new DatabaseException("Failed to validate idempotency request`");
        }
    }   

    
}

const idempotencyRepository = new IdempotencyRepository();
export default idempotencyRepository;




