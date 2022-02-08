import { RequestHandler } from "express";
// import { UrlNotFoundException } from '../../exceptions/urlNotFound.exception.js';
// import { ResponseMessage } from '../../types/messages.interface.js';
import { BusinessAccountService } from "../services/businessAccount.service.js";

export class BusinessController {
    static createAccount: RequestHandler = async (req, res) => {
        const users = await BusinessAccountService.createBusinessAccount(
            req.body
        );
        // const response: ResponseMessage = {
        //   status: 200,
        //   message: 'success',
        //   data: { users }
        // };
        res.status(200).json(users);
    };

    // getAccountById: RequestHandler = async (req, res) => {
    // const { id } = req.params;
    // const user = await userService.getUserById(id);
    // if (!user) throw new UrlNotFoundException(req.originalUrl);
    // const response: ResponseMessage = {
    //   status: 200,
    //   message: 'success',
    //   data: { user }
    // };
    // res.status(response.status).json(response);
    // };
    // transactionToBusiness: RequestHandler = async (req, res) => {};
    // transactionToIndividual: RequestHandler = async (req, res) => {};
}
const businessController = new BusinessController();
export default businessController;
