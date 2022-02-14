import express from 'express';
import individualController from '../controllers/individualAccount.controller.js';
import raw from '../middlewares/route.async.wrapper.js';
import individualMiddlewares from '../middlewares/individualAccount.middleware.js';
import accountMiddlewares from '../middlewares/account.middleware.js';

class IndividualAccountRouter {
  private readonly individualAccountRouter = express.Router();

  constructor() {
    this.individualAccountRouter.post('/', raw(individualMiddlewares.verifyCreation), raw(individualController.createIndividualAccount));

    this.individualAccountRouter.get('/:account_id', raw(accountMiddlewares.verifyGetAccount), raw(individualController.getIndividualAccount));
    this.individualAccountRouter.get('/transfer/individual', raw(individualController.transferIndividualToFamily));
  }

  get router() {
    return this.individualAccountRouter;
  }
}

const individualAccountRouter = new IndividualAccountRouter();

export default individualAccountRouter;
