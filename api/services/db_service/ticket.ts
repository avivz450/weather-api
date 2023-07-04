import { Ticket } from '../../modules/ticket';
import { ticketMongoProvider } from '../../providers/mongo-provider/ticket.js';
import {DateRange, Pagination} from "../../types/types";

export class TicketDBService {
  async getTickets(correlationId: string, filters: Partial<Ticket>, dateRange: DateRange, pagination:Pagination): Promise<Ticket[]> {
    const methodName = 'TicketDBService/getTickets';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(filters, correlationId, `${methodName} - input: `);

    try {
      const retrievedTickets = await ticketMongoProvider.getTickets(correlationId, filters, dateRange, pagination);

      logger.obj(retrievedTickets, `${correlationId} ${methodName} - result: `);
      logger.info(correlationId, `${methodName} - end`);
      return retrievedTickets;
    } catch (error) {
      logger.err(correlationId, `${methodName} - error: `, error);
      throw error;
    }
  }
}

const ticketDBService = new TicketDBService();
export {ticketDBService};
