import { RequestHandler } from 'express';
import { ResponseMessage } from '../types/messages.types.js';
import { AccountService } from '../services/account.service.js';

export class AccountController {
  // activeOrDiactiveAccounts: RequestHandler = async (req, res) => {
  //   const accountIds_and_status = await AccountService.changeStatusAccountsByAccountIds(
  //     req.params.action,
  //     req.body.account_ids,
  //   );
  //   const response: ResponseMessage = {
  //     status: 200,
  //     message: 'success',
  //     data: { accountIds_and_status },
  //   };
  //   res.status(response.status).json(response);
  // };
}

const businessController = new AccountController();
export default businessController;
