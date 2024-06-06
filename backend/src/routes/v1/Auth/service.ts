import CustomError from '../../../utils/Error';
import { getUserByEmailForAuth } from '../Users/repository';
import { Auth } from './types';
import { messages } from '../../../utils/Messages';
import { signJwt, verifyJwt } from '../../../utils/Jwt';
import { omit } from '../../../utils';
import { userPrivateFields } from '../Users/model';

const AuthService = {
  async login(data: Auth) {
    const user = await getUserByEmailForAuth(data.email);
    if (!user) throw new CustomError(messages.auth.invalid_account, 401);

    const isValid = await user.comparePassword(data.password);
    if (!isValid) throw new CustomError(messages.auth.invalid_account, 401);

    const accessToken = signJwt(omit(user.toJSON(), userPrivateFields), 'accessToken', { expiresIn: '1h' });
    const refreshToken = signJwt({ userId: user._id.toString() }, 'refreshToken', { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  },

  async verifyToken(token: string, type: 'accessToken' | 'refreshToken') {
    const user = verifyJwt(token, type);
    console.log(user);
  },
};

export default AuthService;
