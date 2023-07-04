import { RequestHandler } from 'express';
import { Account } from '../modules/account.js';
import { HttpStatusCodes } from '../types/http_status_codes.js';

const validateAccountTypes: RequestHandler = (req, res, next) => {
  const methodName = 'Account/validateAccountTypes';
  logger.info(req.correlationId, `${methodName} - start`);
  const dataToValidate = { ...req.body, ...req.params, ...req.query };
  logger.obj(dataToValidate, `${req.correlationId} ${methodName} - input: `);
  try {
    Account.validateTypes(req.correlationId, dataToValidate);
    next();
  } catch (err: any) {
    logger.err(req.correlationId, `${methodName} - error: `, err);
    return res.error(err, HttpStatusCodes.BAD_REQUEST);
  }
};

export default validateAccountTypes;
