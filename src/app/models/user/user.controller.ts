/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { User } from './user.model';

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email,
    });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Something went Wrong!!', error: error.message });
  }
};

export const UserController = {
  createUser
};

