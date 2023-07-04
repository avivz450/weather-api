import { RequestHandler } from 'express';
import { Ticket } from '../modules/ticket';
import { ticketService } from '../services/ticket';
import {HttpStatusCodes} from "../types/enums";
import {check, validationResult} from "express-validator";
import {DateRange, Pagination} from "../types/types";
import {getDefinedValues} from "../utilities/objects";


export class TicketController {
  getTickets: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'TicketController/getTickets';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      logger.verbose(req.correlationId, `${methodName} - calling TicketController/validateRequest`);
      await this.validateRequest(req);

      const filters = req.query;
      const dateRange :DateRange = {from: Number(req.query.from), to: Number(req.query.to)}
      const pagination :Pagination = {page: Number(req.query.page) || 1, limit: Number(req.query.limit) || Ticket.PAGE_SIZE}
      const ticketFilters: Ticket = new Ticket(filters);

      logger.verbose(req.correlationId, `${methodName} - calling TicketService/getTickets`);
      const tickets: Ticket[] = await ticketService.getTickets(req.correlationId, getDefinedValues(ticketFilters), dateRange, pagination);
      logger.obj(tickets, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done(tickets);
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_GET_TICKETS';
      return res.error(err, HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  };

  validateRequest = async (req: any): Promise<void> => {
    const validationRules = [
      check('title').optional().isString().withMessage('Title must be a string'),
      check('content').optional().isString().withMessage('Content must be a string'),
      check('userEmail').optional().isEmail().withMessage('Invalid email address'),
      check('from').optional().isInt().withMessage('Invalid "from" date'),
      check('to').optional().isInt().withMessage('Invalid "to" date'),
      check('page').optional().isInt().withMessage('Invalid page number'),
      check('limit').optional().isInt().withMessage('Invalid limit value'),
    ];

    await Promise.all(validationRules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new Error(`Validation error: ${errorMessages.join(', ')}`);
    }
  };
}

const ticketController = new TicketController();
export { ticketController };
