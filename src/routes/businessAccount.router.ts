import express from 'express';
import { BusinessController } from '../controllers/businessAccount.controller.js';
import businessMiddlewares from '../middlewares/businessAccount.middleware.js';
import accountMiddlewares from '../middlewares/account.middleware.js';

import raw from '../middlewares/route.async.wrapper.js';

class BusinessAccountRouter {
  private readonly businessAccountRouter = express.Router();

  constructor() {
    this.businessAccountRouter.post(
      '/',
      raw(businessMiddlewares.verifyCreation),
      raw(BusinessController.createBusinessAccount),
    );
    this.businessAccountRouter.get(
      '/:account_id',
      raw(accountMiddlewares.verifyGetAccount),
      raw(BusinessController.getBusinessAccount),
    );
    this.businessAccountRouter.post(
      '/business/transfer/business',
      raw(BusinessController.transferBusinessToBusiness),
    );

    this.businessAccountRouter.post(
      '/business/transfer/individual',
      raw(BusinessController.transferBusinessToIndividual),
    );
  }

  get router() {
    return this.businessAccountRouter;
  }
}

const businessAccountRouter = new BusinessAccountRouter();

export default businessAccountRouter;
