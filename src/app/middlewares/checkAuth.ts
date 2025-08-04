import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
// import { Role } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new AppError(
          401,
          'Unauthorized access, please provide a valid token'
        );
      }

      // const verifiedToken = jwt.verify(accessToken, 'secret');

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(
          403,
          'Forbidden access, only admins can access this route'
        );
      }

      req.user = verifiedToken;

      next();
    } catch (error) {
      next(error);
    }
  };