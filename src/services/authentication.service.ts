import { AuthenticationException } from '../exceptions/authentication.exception.js';
import authenticationRepository from '../repositories/Authenication.Repository.js';
import { IGeneralObj } from '../types/general.types.js';

class AuthenticationService {
    async getSecretKey(access_key: string) {
        const secert_key = await authenticationRepository.getSecretKey(access_key);
        if (!secert_key) {
            throw new AuthenticationException("Unautherized request denined");
        }
        return secert_key;
    }   

    async validateSignatrues(signature: string, signature2compare: string) {
        if (signature === signature2compare) {
            return true;
        }
        throw new AuthenticationException("Unautherized request denied");
    }
}

const authenticationService = new AuthenticationService();
export default authenticationService;
