import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import { BusinessAccountService } from '../services/businessAccount.service.js';
import { IBusinessAccount, ITransferRequest } from '../types/account.types.js';

export class BusinessController {
  static createBusinessAccount: RequestHandler = async (req, res) => {
    const business_account = await BusinessAccountService.createBusinessAccount(req.body as IBusinessAccount);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { business_account },
    };
    res.status(response.status).json(response);
  };

  static getBusinessAccount: RequestHandler = async (req, res) => {
    const { account_id } = req.params;
    const business_account = await BusinessAccountService.getBusinessAccount(account_id);
    //   if (!businessAccount) throw new UrlNotFoundException(req.originalUrl);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { business_account },
    };
    res.status(response.status).json(response);
  };

  static transferBusinessToBusiness: RequestHandler = async (req, res) => {
    const busines_account = await BusinessAccountService.transferBusinessToBusiness(
      req.body as ITransferRequest,
    );
    //   if (!businessAccount) throw new UrlNotFoundException(req.originalUrl);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { busines_account },
    };
    res.status(response.status).json(response);
  };

  static transferBusinessToIndividual: RequestHandler = async (req, res) => {
    const busines_account = await BusinessAccountService.transferBusinessToIndividual(
      req.body as ITransferRequest,
    );
    //   if (!businessAccount) throw new UrlNotFoundException(req.originalUrl);
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { busines_account },
    };
    res.status(response.status).json(response);
  };
}
const businessController = new BusinessController();
export default businessController;
