import { Response } from "express";

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
  error?: any;
}

export const sendSuccess = (
  res: Response,
  data: any = null,
  message: string = "Operation successful",
  statusCode: number = 200
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = "Operation failed",
  statusCode: number = 500,
  error: any = null
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
  };

  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

export const sendAuthSuccess = (
  res: Response,
  token: string,
  user: any,
  message: string = "Authentication successful",
  statusCode: number = 200
): Response => {
  const response: ApiResponse = {
    success: true,
    message,
    token,
    data: { user },
  };

  return res.status(statusCode).json(response);
};
