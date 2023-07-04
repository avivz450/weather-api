import { Ticket } from '../modules/ticket';
import { ticketDBService } from './db_service/ticket.js';
import {DateRange, Pagination} from "../types/types";
import {getDefinedValues} from "../utilities/objects";

export class TicketService {
  async getTickets(correlationId: string, filters: Partial<Ticket>, dateRange: DateRange, pagination:Pagination): Promise<Ticket[]> {
    const methodName = 'TicketService/getTickets';
    logger.info(correlationId, `${methodName} - start`);
    logger.obj(filters, correlationId, `${methodName} - input parameters:`);

    try {
      logger.verbose(correlationId, `${methodName} - calling TicketService/validateInput`);
      this.validateInput(correlationId, dateRange, pagination);

      logger.verbose(correlationId, `${methodName} - calling TicketDBService/getTickets`);
      const tickets: Ticket[] = await ticketDBService.getTickets(correlationId, filters, dateRange, pagination);

      logger.obj(tickets, `${correlationId} ${methodName} - result:`);
      logger.info(correlationId, `${methodName} - end`);
      return tickets;
    } catch (err) {
      logger.err(correlationId, `${methodName} - error:`, err);
      throw err;
    }
  }

  validateInput(correlationId: string, dateRange: DateRange, pagination: Pagination): void {
    const validationErrors: string[] = [];

    if (dateRange.from !== undefined && (dateRange.from < 0)) {
      validationErrors.push('Invalid "from" date');
    }
    if (dateRange.to !== undefined && (dateRange.to < 0)) {
      validationErrors.push('Invalid "to" date');
    }
    if (pagination.page !== undefined && (pagination.page < 1)) {
      validationErrors.push('Invalid page number');
    }
    if (pagination.limit !== undefined && (pagination.limit < 0)) {
      validationErrors.push('Invalid limit value');
    }

    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join(', ');
      logger.err(correlationId, `Validation Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    if(pagination.limit > Ticket.PAGE_SIZE){
      pagination.limit = Ticket.PAGE_SIZE;
    }
  }
}

const ticketService = new TicketService();
export { ticketService };
