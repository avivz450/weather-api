import {RequestHandler} from "express";
import {Account} from "../modules/account";
import logger from "@ajar/marker";
import {HttpStatusCodes} from "../types/http_status_codes";

const validateAccountTypes: RequestHandler = (req, res, next) => {
    const method_name = "Account/validateTypes";
    logger.info(req.correlation_id, `${method_name} - start`);
    logger.verbose(req.correlation_id, `${method_name} - input`, req);
    try{
        const data_to_validate = {...req.body, ...req.params};
        Account.validateTypes(req.correlation_id,data_to_validate);
        next();
    }catch (err:any) {
        logger.err(req.correlation_id, `${method_name} - error: `, err);
        return res.error(err, HttpStatusCodes.BAD_REQUEST);
    }
};

export default validateAccountTypes;
