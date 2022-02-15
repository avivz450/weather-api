import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticationException } from '../exceptions/authentication.exception.js';
import authenticationService from '../services/authentication.service.js';
import CryptoJS from 'crypto-js';

export default async function authenticateRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const http_method = req.method;               
    const url_path = req.originalUrl;  
    const salt = req.headers['x-salt'] as string; 
    const timestamp = req.headers['x-timestamp'] as string;                  
    const signature = req.headers['x-signature'] as string;
    const access_key  = req.headers['x-access-key'] as string;
    const { agent_id, secret_key } = await authenticationService.getSecretKeyAndAgentIdByAccessKey(access_key);

  // for idempotency enforcement
  req.agent_id = agent_id.toString();

  let body = '';

  if (req.body && req.body !== '') {
    body = JSON.stringify(req.body);
  }

  const to_sign = http_method + url_path + salt + timestamp + access_key + secret_key + body;
  let signature_to_compare = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(to_sign, secret_key));
  signature_to_compare = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature_to_compare));

  const isValidSignature = await authenticationService.validateSignatrues(signature as string, signature_to_compare);
  isValidSignature ? next() : next(new AuthenticationException('Unautherized request denied'));
};
