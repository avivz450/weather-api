import { AuthenticationException } from '../exceptions/authentication.exception.js';
import authenticationRepository from '../repositories/authenication.repository.js';
import { IGeneralObj } from '../types/general.types.js';

class AuthenticationService {
  async getSecretKey(access_key: string) {
    const secret_key = await authenticationRepository.getSecretKey(access_key);
    if (!secret_key) {
      throw new AuthenticationException('Unautherized request denined');
    }
    return secret_key;
  }

  async validateSignatrues(signature: string, signature2compare: string) {
    if (signature === signature2compare) {
      return true;
    }
    throw new AuthenticationException('Unautherized request denied');
  }
}

const authenticationService = new AuthenticationService();
export default authenticationService;
