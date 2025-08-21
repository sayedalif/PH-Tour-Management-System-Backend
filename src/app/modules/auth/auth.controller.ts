/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { authServices } from './auth.service';
import AppError from '../../errorHelpers/AppError';
import { setAuthCookie } from '../../utils/setCookie';
import { JwtPayload } from 'jsonwebtoken';
import { createUserTokens } from '../../utils/userTokens';
import { envVars } from '../../config/env';
import passport from 'passport';

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialsLogin(req.body);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate('local', async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }

      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = await createUserTokens(user);
      console.log(user);

      const { password: pass, ...rest } = user.toObject();

      // delete user.toObject().password;

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User Logged In Successfully',
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      new AppError(
        StatusCodes.BAD_REQUEST,
        'No refresh token received from cookies'
      );
    }

    const tokenInfo = await authServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'New Access Token Retrieved Successfully',
      data: tokenInfo,
    });
  }
);

const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User Logged Out Successfully',
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;

    await authServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Password Changed Successfully',
      data: null,
    });
  }
);

const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : '';

    if (redirectTo.startsWith('/')) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User Not Found');
    }
    const tokenInfo = await createUserTokens(user);
    setAuthCookie(res, tokenInfo);

    // sendResponse(res, {
    //   statusCode: StatusCodes.OK,
    //   success: true,
    //   message: 'Password Changed Successfully',
    //   data: null,
    // });

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const authControllers = {
  credentialsLogin,
  getNewAccessToken,
  logOut,
  resetPassword,
  googleCallbackController,
};
