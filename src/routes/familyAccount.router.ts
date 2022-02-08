import express from 'express';
// import creationController from "../creationController.controller.js";
// import raw from "../middlewares/route.async.wrapper.js";

class FamilyAccountRouter {
  private readonly familyAccountRouter = express.Router();

  // constructor() {
  //     this.familyAccountRouter.post(
  //         "/",
  //         raw(creationController.createAccount)
  //     );
  // }

  get router() {
    return this.familyAccountRouter;
  }
}

const familyAccountRouter = new FamilyAccountRouter();

export default familyAccountRouter;
