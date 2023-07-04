import { Router } from 'express';
import {ticketController} from '../controllers/ticket';

class TicketRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', ticketController.getTickets);
  }

  public getRouter() {
    return this.router;
  }
}

const ticketRouter = new TicketRouter();

export default ticketRouter.getRouter();
