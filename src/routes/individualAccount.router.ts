import express from "express";
// import creationController from "../creationController.controller.js";
// import raw from "../middlewares/route.async.wrapper.js";
// import verifyIndividualAccountCreation from "../middlewares/individualAccount.middleware.js";

class IndividualAccountRouter {
    private readonly individualAccountRouter = express.Router();

    // constructor() {
    // this.individualAccountRouter.post(
    //     "/",
    //     raw(verifyIndividualAccountCreation),
    //     raw(creationController.createAccount)
    // );
    //  }

    get router() {
        return this.individualAccountRouter;
    }
}

const individualAccountRouter = new IndividualAccountRouter();

export default individualAccountRouter;
