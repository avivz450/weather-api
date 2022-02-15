import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import familyAccountService from '../services/familyAccount.service.js';
import { DetailsLevel, IFamilyAccount, IFamilyAccountCreationInput, IndividualTransferDetails, ITransferRequest } from '../types/account.types.js';
import { IIdempotencyRequest } from '../types/idempotency.types.js';
import idempotencyService from '../services/idempotency.service.js';
import saveResponseData from '../utils/idemoptency.utils.js';

class FamilyAccountController {
  createFamilyAccount: RequestHandler = async (req, res) => {
    const family_account = await familyAccountService.createFamilyAccount(req.body as IFamilyAccountCreationInput);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  getFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id, details_level } = req.params;
    const family_account = await familyAccountService.getFamilyAccountById(account_id, details_level as DetailsLevel);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  addAccountsToFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id, details_level } = req.params;
    const { individual_accounts_details } = req.body;

    const family_account = await familyAccountService.addIndividualAccountsToFamilyAccount(account_id, individual_accounts_details, details_level as DetailsLevel);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  removeAccountsFromFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id, details_level } = req.params;
    const family_account = await familyAccountService.removeIndividualAccountsFromFamilyAccount(
      account_id,
      req.body.individual_accounts_details as IndividualTransferDetails[],
      details_level as DetailsLevel,
    );
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  closeFamilyAccount: RequestHandler = async (req, res) => {
    const { account_id } = req.params;
    const family_account = await familyAccountService.closeFamilyAccount(account_id);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: family_account,
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  transferFamilyToBusiness: RequestHandler = async (req, res) => {
    const family_account = await familyAccountService.transferFamilyToBusiness(req.body);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { family_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  transferFamilyToIndividual: RequestHandler = async (req, res) => {
    const send_request_transfer = await familyAccountService.sendRequestForTransferToIndividual(req.body);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { send_request_transfer },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };
  confirmTransferFromFamily: RequestHandler = async (req, res) => {
    const {source_account_id,destination_account_id,approver_account_id,amount} = req.params;
    const response_transfer = await familyAccountService.confirmTransferFromFamily(source_account_id,destination_account_id,approver_account_id,amount);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { response_transfer },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };
}

const familyAccountController = new FamilyAccountController();
export default familyAccountController;
