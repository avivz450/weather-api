import express from "express";
import { BusinessController } from "../controllers/businessAccount.controller.js";
import raw from "../middlewares/route.async.wrapper.js";

class BusinessAccountRouter {
    private readonly businessAccountRouter = express.Router();

<<<<<<< HEAD
  constructor() {
    this.businessAccountRouter.post('/', );
  }
=======
    constructor() {
        this.businessAccountRouter.post(
            "/",
            raw(BusinessController.createBusinessAccount)
        );
        this.businessAccountRouter.get(
            "/:account_id",
            raw(BusinessController.getBusinessAccount)
        );
        this.businessAccountRouter.post(
            "/business/transfer/business",
            raw(BusinessController.transferBusinessToBusiness)
        );
>>>>>>> Updated services

        this.businessAccountRouter.post(
            "/business/transfer/individual",
            raw(BusinessController.transferBusinessToIndividual)
        );
    }

    get router() {
        return this.businessAccountRouter;
    }
}

const businessAccountRouter = new BusinessAccountRouter();

export default businessAccountRouter;
