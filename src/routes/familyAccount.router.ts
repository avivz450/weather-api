import express from 'express';
import familyAccountController from '../controllers/familyAccount.controller.js';
import raw from '../middlewares/route.async.wrapper.js';
import familyMiddlewares from '../middlewares/familyAccount.middleware.js';

class FamilyAccountRouter {
  private readonly familyAccountRouter = express.Router();

  constructor() {
    this.familyAccountRouter.post('/', raw(familyMiddlewares.verifyCreation), raw(familyAccountController.createFamilyAccount));
    this.familyAccountRouter.get('/:account_id/:details_level', raw(familyMiddlewares.verifyGet), raw(familyAccountController.getFamilyAccount));
    this.familyAccountRouter.post('/add-accounts/:account_id/:details_level', raw(familyMiddlewares.verifyAddIndividuals), raw(familyAccountController.addAccountsToFamilyAccount));
    this.familyAccountRouter.patch('/remove-accounts/:account_id/:details_level', raw(familyMiddlewares.verifyRemoveIndividuals), raw(familyAccountController.removeAccountsFromFamilyAccount));
    this.familyAccountRouter.patch('/close/:account_id', raw(familyMiddlewares.verifyCloseAccount), raw(familyAccountController.closeFamilyAccount));
    this.familyAccountRouter.post('/:transfer/business', raw(familyMiddlewares.verifyTransferToBusiness), raw(familyAccountController.transferFamilyToBusiness));
    this.familyAccountRouter.post('/:transfer/individual', raw(familyAccountController.transferFamilyToIndividual));
    this.familyAccountRouter.post('/confirm-transfer/:source_account_id/:amount/:destination_account_id/:approver_account_id', raw(familyAccountController.confirmTransferFromFamily));
  }

  get router() {
    return this.familyAccountRouter;
  }
}

const familyAccountRouter = new FamilyAccountRouter();

export default familyAccountRouter;
