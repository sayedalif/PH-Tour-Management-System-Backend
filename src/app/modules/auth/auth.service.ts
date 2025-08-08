import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import bcryptjs from 'bcryptjs';
import { IUser } from '../user/user.interface';
import { createUserTokens } from '../../utils/userTokens';
import { createNewAccessTokenWithRefreshToken } from './../../utils/userTokens';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });

  if (!isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User does not exist');
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
  }

  const userTokens = await createUserTokens(isUserExists);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: pass, ...rest } = isUserExists.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user?.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Old password is incorrect');
  }

  const newHashedPassword = await bcryptjs.hash(
    newPassword,
    parseInt(envVars.BCRYPT_SALT_ROUNDS)
  );

  user.password = newHashedPassword;

  await user?.save();
};

// user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token

export const authServices = {
  credentialsLogin,
  getNewAccessToken,
  resetPassword,
};
