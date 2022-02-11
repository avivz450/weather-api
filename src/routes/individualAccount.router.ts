import express from 'express';
import { IndividualController } from '../controllers/individualAccount.controller.js';
import raw from '../middlewares/route.async.wrapper.js';
import {verifyIndividualAccountCreation , verifyGetIndividualAccount} from "../middlewares/individualAccount.middleware.js";

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
      // raw(verifyGetIndividualAccount),
      raw(IndividualController.getIndividualAccount),
    );
    this.individualAccountRouter.get(
      '/transfer/individual',
      raw(IndividualController.transferIndividualToFamily),
    );
  }

  get router() {
    return this.individualAccountRouter;
  }
}

const individualAccountRouter = new IndividualAccountRouter();

export default individualAccountRouter;
