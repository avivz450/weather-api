import { AuthenticationException } from '../exceptions/authentication.exception.js';
import authenticationRepository from '../repositories/authenication.repository.js';

class AuthenticationService {
  async getSecretKeyAndAgentIdByAccessKey(access_key: string) {
    const agent_id_and_secret_key = await authenticationRepository.getSecretKeyAndAgentIdByAccessKey(access_key);
    if (!agent_id_and_secret_key) {
      throw new AuthenticationException('Unautherized request denined');
    }
    return agent_id_and_secret_key;
  }

  validateSignatrues(signature: string, signature2compare: string) {
    if (signature === signature2compare) {
      return true;
    }
    throw new AuthenticationException('Unautherized request denied');
  }
}

const authenticationService = new AuthenticationService();
export default authenticationService;
