import express from 'express';
import {FamiAccountController} from "../controllers/familyAccount.controller.js";
import raw from "../middlewares/route.async.wrapper.js";

class FamilyAccountRouter {
  private readonly familyAccountRouter = express.Router();

  constructor() {
      this.familyAccountRouter.post(
          "/",
          raw(FamiAccountController.createFamilyAccount)
          );
      this.familyAccountRouter.get(
          ":account_id/:details_level",
          raw(FamiAccountController.getFamilyAccount)
        );
      this.familyAccountRouter.post(
        "/add-accounts/:account_id/:details_level",
        raw(FamiAccountController.addAccountsToFamilyAccount)
      );
      this.familyAccountRouter.patch(
        "/remove-accounts/:account_id/:details_level",
        raw(FamiAccountController.removeAccountsFromFamilyAccount)
      );
      this.familyAccountRouter.patch(
        "/close/:account_id",
        raw(FamiAccountController.closeFamilyAccount)
      );
      this.familyAccountRouter.post(
        "/family/transfer/bussines",
        raw(FamiAccountController.transferFamilyToBusiness)
      );
      
  }

  get router() {
    return this.familyAccountRouter;
  }
}

const familyAccountRouter = new FamilyAccountRouter();

export default familyAccountRouter;
