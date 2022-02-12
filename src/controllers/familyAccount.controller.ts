import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import { FamilyAccountService } from '../services/familyAccount.service.js';
import {
  DetailsLevel,
  IFamilyAccount,
  IFamilyAccountCreationInput,
  IndividualTransferDetails,
  ITransferRequest,
} from '../types/account.types.js';
import logicError from '../exceptions/logic.exception.js';

class FamilyAccountController {
  //  createFamilyAccount: RequestHandler = async (req, res) => {
  //   const family_account = await FamilyAccountService.createFamilyAccount(req.body as IFamilyAccountCreationInput);
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { family_account },
  //   };
  //   res.status(response.status).json(response);
  // };
  //  getFamilyAccount: RequestHandler = async (req, res) => {
  //   const { account_id,details_level} = req.params;
  //   const family_account = await FamilyAccountService.getFamilyAccountsByAccountIds(account_id,details_level as DetailsLevel);
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { family_account },
  //   };
  //   res.status(response.status).json(response);
  // };
  //  addAccountsToFamilyAccount: RequestHandler = async (req, res) => {
  //   const { account_id,details_level } = req.params;
  //   const family_account = await FamilyAccountService.addIndividualAccountsToFamilyAccount(account_id,req.body as IndividualTransferDetails[],details_level as DetailsLevel);
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { family_account },
  //   };
  //   res.status(response.status).json(response);
  // };
  //  removeAccountsFromFamilyAccount: RequestHandler = async (req, res) => {
  //   const { account_id,details_level } = req.params;
  //   const family_account = await FamilyAccountService.removeIndividualAccountsFromFamilyAccount(account_id, req.body.individual_accounts_details as IndividualTransferDetails[],details_level as DetailsLevel);
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { family_account },
  //   };
  //   res.status(response.status).json(response);
  // };
  //  closeFamilyAccount: RequestHandler = async (req, res) => {
  //   const { account_id} = req.params;
  //   const family_account = await FamilyAccountService.closeFamilyAccount(account_id);
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { family_account },
  //   };
  //   res.status(response.status).json(response);
  // };
  //  transferFamilyToBusiness: RequestHandler = async (req, res) => {
  //   const family_account = await FamilyAccountService.transferFamilyToBusiness(req.body);
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { family_account },
  //   };
  //   res.status(response.status).json(response);
  // };
}

const familyAccountController = new FamilyAccountController();
export default familyAccountController;
