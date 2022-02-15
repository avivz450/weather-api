import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import businessAccountService from '../services/businessAccount.service.js';
import { IBusinessAccount, ITransferRequest } from '../types/account.types.js';
import saveResponseData from '../utils/idemoptency.utils.js';

class BusinessController {
  createBusinessAccount: RequestHandler = async (req, res) => {
    const business_account = await businessAccountService.createBusinessAccount(req.body as IBusinessAccount);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { business_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  getBusinessAccount: RequestHandler = async (req, res) => {
    const { account_id } = req.params;
    const business_account = await businessAccountService.getBusinessAccount(account_id);

    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { business_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  transferBusinessToBusiness: RequestHandler = async (req, res) => {
    const transfer_data = await businessAccountService.transferBusinessToBusiness(req.body as ITransferRequest);

    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: transfer_data,
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };

  transferBusinessToIndividual: RequestHandler = async (req, res) => {
    const busines_account = await businessAccountService.transferBusinessToIndividual(req.body as ITransferRequest);
    //   if (!businessAccount) throw new UrlNotFoundException(req.originalUrl);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { busines_account },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };
}
const businessController = new BusinessController();
export default businessController;
