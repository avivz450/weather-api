import { OkPacket, RowDataPacket } from 'mysql2';
import { sql_con } from '../db/sql/sql.connection.js';
import DatabaseException from '../exceptions/db.exception.js';
import { IIdempotencyRequest, IIdempotencyResponse } from '../types/idempotency.types.js';

class IdempotencyRepository {
  async getResponseByIdempotencyKey(idempotency_request: IIdempotencyRequest): Promise<IIdempotencyResponse | null> {
        try {
            const { agent_id, idempotency_key } = idempotency_request;
            const query = `SELECT data 
                            FROM idempotency
                            WHERE agentID = ? AND idempotencyKey = ?`
            const [idempotency_query_res] = (await sql_con.query(
                query,
                [agent_id, idempotency_key]
            )) as RowDataPacket[][];
            
            if (!idempotency_query_res[0]) {
                return null
            }

            let { data } = idempotency_query_res[0];
            data = JSON.parse(data);

            return data ? { data } as IIdempotencyResponse : null;
        } catch (err) {
            throw new DatabaseException("Failed to validate idempotency request`");
        }
    }   

    async saveResponseData(idempotency_request: IIdempotencyRequest): Promise<boolean | null> {
        try {
            const { agent_id, idempotency_key, body } = idempotency_request;
            const query = `INSERT INTO idempotency 
                            (agentID, idempotencyKey, data) 
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
