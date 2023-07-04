import { Ticket } from '../../modules/ticket';
import { MongoClient, Db, Collection } from 'mongodb';
import {DateRange, Pagination} from "../../types/types";

export class TicketMongoProvider {
  private client: MongoClient;
  private db: Db;
  private collection: Collection<Ticket>;
  private collectionName = 'tickets';

  async connect(mongoUrl, dbName): Promise<void> {
    try {
      this.client = new MongoClient(mongoUrl);
      await this.client.connect();
      this.db = this.client.db(dbName);
      this.collection = this.db.collection<Ticket>(this.collectionName);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    }
  }

  async getTickets(correlationId: string, filters: Partial<Ticket>, dateRange: DateRange, pagination:Pagination) {
    const methodName = 'ticketMongoProvider/getTickets';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(filters, `${correlationId} ${methodName} - input: `);
    try {

      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      const creationTime = {}

      if(dateRange.from){
        creationTime["$gte"] = dateRange.from
      }
      if(dateRange.to){
        creationTime["$lte"] = dateRange.to
      }

      const query = {
        ...filters
      };

      if(Object.keys(creationTime).length !== 0){
        query["creationTime"] = creationTime;
      }

      const ticketsCursor = this.collection.find(query).skip(skip).limit(limit);
      const result = await ticketsCursor.toArray();

      logger.obj(result, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return result;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error: `, err);
      throw err;
    }
  }
}

const ticketMongoProvider = new TicketMongoProvider();
export { ticketMongoProvider };
