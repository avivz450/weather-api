import { RequestHandler } from 'express';
import {HttpStatusCodes} from "../types/enums";

export const urlNotFound: RequestHandler = (req, res) => {
  res.error(new Error('URL_NOT_FOUND'), HttpStatusCodes.NOT_FOUND);
};
