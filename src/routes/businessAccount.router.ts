import express from "express";
// import creationController from "../creationController.controller.js";
// import raw from "../middlewares/route.async.wrapper.js";

class BusinessAccountRouter {
    private readonly businessAccountRouter = express.Router();

    // constructor() {
    //     this.businessAccountRouter.post(
    //         "/",
    //         raw(creationController.createAccount)
    //     );
    // }

    get router() {
        return this.businessAccountRouter;
    }
}

const businessAccountRouter = new BusinessAccountRouter();

export default businessAccountRouter;
