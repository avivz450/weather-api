import express from 'express';
import { IndividualController } from '../controllers/individualAccount.controller.js';
import raw from '../middlewares/route.async.wrapper.js';
// import verifyIndividualAccountCreation from "../middlewares/individualAccount.middleware.js";

class IndividualAccountRouter {
  private readonly individualAccountRouter = express.Router();

  constructor() {
    this.individualAccountRouter.post(
      '/',
      // raw(verifyIndividualAccountCreation),
      raw(IndividualController.createIndividualAccount),
    );

    this.individualAccountRouter.get(
      '/:account_id',
      // raw(verifyIndividualAccountCreation),
      raw(IndividualController.getIndividualAccount),
    );
  }

  get router() {
    return this.individualAccountRouter;
  }
}

const individualAccountRouter = new IndividualAccountRouter();

export default individualAccountRouter;
