import express from 'express';
import { BusinessController } from '../controllers/businessAccount.controller.js';
import raw from '../middlewares/route.async.wrapper.js';

class BusinessAccountRouter {
  private readonly businessAccountRouter = express.Router();

  constructor() {
    this.businessAccountRouter.post('/', );
  }

  get router() {
    return this.businessAccountRouter;
  }
}

const businessAccountRouter = new BusinessAccountRouter();

export default businessAccountRouter;
