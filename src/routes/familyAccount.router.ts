import express from 'express';
import familyAccountController from '../controllers/familyAccount.controller.js';
import raw from '../middlewares/route.async.wrapper.js';
import familyMiddlewares from '../middlewares/familyAccount.middleware.js';
import accountMiddlewares from '../middlewares/account.middleware.js';

class FamilyAccountRouter {
  private readonly familyAccountRouter = express.Router();

  constructor() {
    this.familyAccountRouter.post(
      '/',
      raw(familyMiddlewares.verifyCreation),
      raw(familyAccountController.createFamilyAccount),
    );
    this.familyAccountRouter.get(
        "/:account_id/:details_level",
        raw(accountMiddlewares.verifyGetAccount),
        raw(familyAccountController.getFamilyAccount)
      );
    this.familyAccountRouter.post(
      "/add-accounts/:account_id/:details_level",
      raw(familyMiddlewares.verifyAddIndividuals),
      raw(familyAccountController.addAccountsToFamilyAccount)
    );
    this.familyAccountRouter.patch(
      "/remove-accounts/:account_id/:details_level",
      raw(familyAccountController.removeAccountsFromFamilyAccount)
    );
    this.familyAccountRouter.patch(
      '/close/:account_id',
      raw(familyMiddlewares.verifyCloseAccount),
      raw(familyAccountController.closeFamilyAccount)
    );
    this.familyAccountRouter.post(
      "/family/transfer/bussines",
      raw(familyAccountController.transferFamilyToBusiness)
    );
  }

  get router() {
    return this.familyAccountRouter;
  }
}

const familyAccountRouter = new FamilyAccountRouter();

export default familyAccountRouter;
