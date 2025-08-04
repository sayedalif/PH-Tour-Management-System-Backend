import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { IAuthProvider, IUser, Role } from './user.interface';
import { User } from './user.model';
import bcryptjs from 'bcryptjs';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

// create a user
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User already exists');
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    parseInt(envVars.BCRYPT_SALT_ROUNDS)
  );

  const authProvider: IAuthProvider = {
    provider: 'credentials',
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {

  const isUserExists = await User.findById(userId);

  if( !isUserExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
  }

  /*
   * email - can not update
   * name, phone, password, adress
   * password - re hashing
   * only admin super admin - role, isDeleted, isActive, isVerified
   */

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized');
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized');
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized');
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password as string,
      parseInt(envVars.BCRYPT_SALT_ROUNDS)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId,payload,{new:true,runValidators:true});

  return newUpdatedUser;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find();

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: { total: totalUsers },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
};
