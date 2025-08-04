import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { User } from '../user/user.model';
import bcryptjs from 'bcryptjs';
import { IUser } from '../user/user.interface';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/jwt';
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

  const jwtPayload = {
    userId: isUserExists.email,
    role: isUserExists.role,
    _id: isUserExists._id,
  };

  // const accessToken = jwt.sign(jwtPayload, 'secret', {
  //   expiresIn: '1d',
  // });

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

// user - login - token (email, role, _id) - booking / payment / booking / payment cancel - token

export const authServices = {
  credentialsLogin,
};
