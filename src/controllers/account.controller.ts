import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import accountService from '../services/account.service.js';
import idempotencyService from '../services/idempotency.service.js';
import { IIdempotencyRequest } from '../types/idempotency.types.js';
import saveResponseData from '../utils/idemoptency.utils.js';

export class AccountController {
  changeStatus: RequestHandler = async (req, res) => {
    const accounts_ids = (req.body.accounts_details as string[]).map(account_details => account_details[0]);
    const account_ids_and_status = await accountService.changeStatusAccountsByAccountIds(req.params.action, accounts_ids);
    
    const response: ResponseMessage = {
      status: 200,
      message: 'success',
      data: { account_ids_and_status },
    };
    await saveResponseData(req, response);
    res.status(response.status).json(response);
  };
}

const businessController = new AccountController();
export default businessController;
