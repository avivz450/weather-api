import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import { FamilyAccountService } from '../services/familyAccount.service.js';
import { IFamilyAccount, IFamilyAccountCreationInput, IndividualTransferDetails, ITransferRequest } from '../types/account.types.js';
import logicError from '../exceptions/logic.exception.js';

export class FamiAccountController {
  static createFamilyAccount: RequestHandler = async (req, res) => {
    const family_account = await FamilyAccountService.createFamilyAccount(req.body as IFamilyAccountCreationInput);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    res.status(response.status).json(response);
  };

  static getFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id,details_level } = req.params;
    const family_account = await FamilyAccountService.getFamilyAccount(account_id,details_level);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    res.status(response.status).json(response);
  };

  static addAccountsToFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id,details_level } = req.params;
    const family_account = await FamilyAccountService.addIndividualAccountsToFamilyAccount(account_id,req.body as IndividualTransferDetails[],details_level);
    //   if (!family_account) throw new UrlNotFoundException(req.originalUrl);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    res.status(response.status).json(response);
  };

  static removeAccountsFromFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id,details_level } = req.params;
    const family_account = await FamilyAccountService.removeIndividualAccountsFromFamilyAccount(account_id, req.body.individual_accounts_details as IndividualTransferDetails[],details_level);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    res.status(response.status).json(response);
  };

  static closeFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id} = req.params;
    const family_account = await FamilyAccountService.closeFamilyAccount(account_id);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    res.status(response.status).json(response);
  };

  static transferFamilyToBusiness: RequestHandler = async (req, res) => {
    const family_account = await FamilyAccountService.transferFamilyToBusiness(req.body);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    res.status(response.status).json(response);
  };
}

const famiAccountController = new FamiAccountController();
export default famiAccountController;
