import fetch from 'node-fetch';
import { APIError } from '../exceptions/api.exception.js';
import { IIndividualAccount, ITransferRequest } from '../types/account.types.js';
import nodemailer, { SentMessageInfo } from 'nodemailer';
import { IGeneralObj } from '../../src/types/general.types.js';
class GenericFunctions {
  getRate = async (source_currency: string, destination_currency: string) => {
    const base_url = `http://api.exchangeratesapi.io/latest`;
    const url = `${base_url}?base=${source_currency}&symbols=${destination_currency}&access_key=78ca52413fb26cdc4a99ec638fa21db7`;
    const response = (await (await fetch(url)).json()) as IGeneralObj;
    const is_success_response: boolean = response.success;

    if (is_success_response === false) {
      throw new APIError("error accessing 'exchangeratesapi'");
    }

    return response.rates[destination_currency];
  };

  sendTransferRequestEmail(owner: Partial<IIndividualAccount>, payload: ITransferRequest) {
    let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      auth: {
        user: 'rapyd@hotmail.com',
        pass: 'rej~Gh/GR2&aaY(',
      },
    });
    const url = `http://localhost:8080/api/account/family/confirm-transfer/${payload.source_account_id}/${payload.amount}/${payload.destination_account_id}/${owner.account_id}`;
    const options = {
      from: 'rapyd@hotmail.com', // sender address
      to: `${owner.email}`, // receivers
      subject: `Transfer request`, // Subject line
      html: `<h1 style="background-color:DodgerBlue;">Transfer request</h1>
      transfer amount ${payload.amount} from your family account "${payload.destination_account_id}" to the owner "${payload.source_account_id}" account <br>    
      Please send a (post) request to confirm the transfer to the attached link <a href="${url}">${url}</a>`, // html bosdy
    };

    // send mail with defined transport object
    transporter.sendMail(options, (err: Error | null, info: SentMessageInfo) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.response);
      }
    });
  }
}

const genericFunctions = new GenericFunctions();
export default genericFunctions;
