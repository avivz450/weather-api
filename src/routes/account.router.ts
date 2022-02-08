import express from 'express';
// import raw from "../middlewares/route.async.wrapper.js";

class AccountRouter {
  private readonly accountRouter = express.Router();

  //    constructor() {}

  get router() {
    return this.accountRouter;
  }
}

const accountRouter = new AccountRouter();

export default accountRouter;
