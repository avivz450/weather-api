import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import IndividualAccountService from '../services/individualAccount.service.js';
import { IIndividualAccount, ITransferRequest } from '../types/account.types.js';
import idempotencyService from '../services/idempotency.service.js';
import { IIdempotencyRequest } from '../types/idempotency.types.js';
import saveResponseData from '../utils/idemoptency.utils.js';

class IndividualController {
  createIndividualAccount: RequestHandler = async (req, res) => {
    const individual_account = await IndividualAccountService.createIndividualAccount(req.body as IIndividualAccount);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { individual_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  getIndividualAccount: RequestHandler = async (req, res) => {
    const { account_id } = req.params;
    const [individual_account] = await IndividualAccountService.getIndividualAccountsByAccountIds([account_id]);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { individual_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  transferIndividualToConnectedFamily: RequestHandler = async (req, res) => {
    const transaction = await IndividualAccountService.transferIndividualToConnectedFamily(req.body as ITransferRequest);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { transaction },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  
}
const individualController = new IndividualController();
export default individualController;
