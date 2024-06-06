import { Request, Response } from 'express';
import { Auth } from './types';
import { successResponse } from '../../../utils/HttpResponse';
import { messages } from '../../../utils/Messages';
import { errorHandler } from '../../../utils/Error/index';
import AuthService from './service';
import UserService from '../Users/service';

const AuthController = {
  async login(req: Request<unknown, unknown, Auth>, res: Response) {
    try {
      const body = req.body;
      const { accessToken } = await AuthService.login(body);
      const user = await UserService.updateUserWithToken(body.email,accessToken);
      return successResponse({
        status: 200,
        response: res,
        message: messages.auth.login_success,
        data: user,
      });
    } catch (error) {
      errorHandler(res, error);
    }
  },
  async logout(req: Request<{id:string}, unknown, Auth>, res: Response) {
    const {id} = req.params
    await UserService.getUserAndUpdateRefreshToken(id)
    successResponse({
      status: 200,
      response: res,
      message: messages.auth.logout,
    });
  },
};

export default AuthController;
