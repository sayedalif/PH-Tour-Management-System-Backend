/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { verifyToken } from '../../utils/jwt';
import { envVars } from '../../config/env';
import { JwtPayload } from 'jsonwebtoken';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    // res
    //   .status(StatusCodes.CREATED)
    //   .json({ message: 'User created successfully', user });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'User created successfully',
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    // res
    //   .status(StatusCodes.CREATED)
    //   .json({ message: 'User created successfully', user });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res
    //   .status(StatusCodes.OK)
    //   .json({ message: 'Users retrieved successfully', data: users });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Successfully Retrieved All Users',
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
};

// route matching -> controller -> service -> model -> DB
