import { Response } from 'express';

interface TMeta {
  total: number;
}

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
}

export function sendResponse<T>(res: Response, data: TResponse<T>) {
  res.status(data.statusCode).json({
    success: data.success,
    StatusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
}
