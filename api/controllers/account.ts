import { RequestHandler } from 'express';
import { Account } from '../modules/account';
import { HttpStatusCodes } from '../types/http_status_codes';
import { accountService } from '../services/account';

export class AccountController {
  getAccounts: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'AccountController/getAccounts';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      const filters = req.query;
      logger.verbose(req.correlationId, `${methodName} - calling AccountService/getAccounts`);
      const accounts: Account[] = await accountService.getAccounts(req.correlationId, filters);
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseObjectToResponse`);
      const result = Account.parseListToResponse(req.correlationId, accounts);
      logger.obj(result, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done(result);
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_GET_ACCOUNTS';
      return res.error(err);
    }
  };

  createAccount: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'AccountController/createAccount';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseFromRequest`);
      const account: Account = Account.parseObjectFromRequest(req.correlationId, req);
      logger.verbose(req.correlationId, `${methodName} - calling AccountService/createAccount`);
      const accountCreationResult: Account = await accountService.createAccount(req.correlationId, account);
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseObjectToResponse`);
      const result = Account.parseObjectToResponse(req.correlationId, accountCreationResult);
      logger.obj(result, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done(result, HttpStatusCodes.CREATED);
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_CREATE_ACCOUNT';
      return res.error(err);
    }
  };

  getAccount: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'AccountController/getAccount';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      const accountId = req.params['account_id'] || '';
      logger.verbose(req.correlationId, `${methodName} - calling AccountService/getAccount`);
      const account: Account = await accountService.getAccount(req.correlationId, accountId);
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseObjectToResponse`);
      const result = Account.parseObjectToResponse(req.correlationId, account);
      logger.obj(result, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done(result);
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_GET_ACCOUNT';
      return res.error(err);
    }
  };

  updateAccount: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'AccountController/updateAccount';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseFromRequest`);
      const account: Account = Account.parseObjectFromRequest(req.correlationId, req);
      logger.verbose(req.correlationId, `${methodName} - calling AccountService/updateAccount`);
      const accountCreationResult: Account = await accountService.updateAccount(req.correlationId, account);
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseObjectToResponse`);
      const result = Account.parseObjectToResponse(req.correlationId, accountCreationResult);
      logger.obj(result, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done(result);
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_UPDATE_ACCOUNT';
      return res.error(err);
    }
  };

  deleteAccount: RequestHandler = async (req, res): Promise<void> => {
    const methodName = 'AccountController/deleteAccount';
    logger.info(req.correlationId, `${methodName} - start`);

    try {
      const accountId = req.params['account_id'] || '';
      logger.verbose(req.correlationId, `${methodName} - calling AccountService/deleteAccount`);
      const deletedAccount: Account = await accountService.deleteAccount(req.correlationId, accountId);
      logger.verbose(req.correlationId, `${methodName} - calling Account/parseObjectToResponse`);
      const result = Account.parseDeletedObjectToResponse(req.correlationId, deletedAccount);
      logger.obj(result, `${req.correlationId} ${methodName} - result: `);
      logger.info(req.correlationId, `${methodName} - end`);
      return res.done(result);
    } catch (err: any) {
      logger.err(req.correlationId, `${methodName} - error: `, err);
      err.message = err.message || 'ERROR_DELETE_ACCOUNT';
      return res.error(err);
    }
  };
}

const accountController = new AccountController();
export { accountController };
