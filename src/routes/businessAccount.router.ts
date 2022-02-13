import express from 'express';
import businessController  from '../controllers/businessAccount.controller.js';
import businessMiddlewares from '../middlewares/businessAccount.middleware.js';
import accountMiddlewares from '../middlewares/account.middleware.js';

import raw from '../middlewares/route.async.wrapper.js';

class BusinessAccountRouter {
  private readonly businessAccountRouter = express.Router();

  constructor() {
    this.businessAccountRouter.post(
      '/',
      raw(businessMiddlewares.verifyCreation),
      raw(businessController.createBusinessAccount),
    );
    this.businessAccountRouter.get(
      '/:account_id',
      raw(accountMiddlewares.verifyGetAccount),
      raw(businessController.getBusinessAccount),
    );
    this.businessAccountRouter.post(
      '/:transfer/business',
      raw(businessMiddlewares.verifyTransferToBusiness),
      raw(businessController.transferBusinessToBusiness),
    );

    this.businessAccountRouter.post(
      '/:transfer/individual',
      raw(businessController.transferBusinessToIndividual),
    );
  }

  get router() {
    return this.businessAccountRouter;
  }
}

const businessAccountRouter = new BusinessAccountRouter();

export default businessAccountRouter;
