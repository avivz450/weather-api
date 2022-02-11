import express from "express";
import { BusinessController } from "../controllers/businessAccount.controller.js";
import { verifyBusinessAccountCreation, verifyGetBusinessAccount } from "../middlewares/businessAccount.middleware.js";
import raw from "../middlewares/route.async.wrapper.js";

class BusinessAccountRouter {
    private readonly businessAccountRouter = express.Router();

    constructor() {
        this.businessAccountRouter.post(
            "/",
            // raw(verifyBusinessAccountCreation),
            raw(BusinessController.createBusinessAccount)
        );
        this.businessAccountRouter.get(
            "/:account_id",
            // raw(verifyGetBusinessAccount),
            raw(BusinessController.getBusinessAccount)
        );
        this.businessAccountRouter.post(
            "/business/transfer/business",
            raw(BusinessController.transferBusinessToBusiness)
        );

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
