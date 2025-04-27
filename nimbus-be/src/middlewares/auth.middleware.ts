import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload as JsonWebTokenPayload } from "jsonwebtoken";
import config from "../config/config";
import User from "../models/User";
import { sendError } from "../utils/apiResponse";

interface JwtPayload extends JsonWebTokenPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Authentication failed. No token provided", 401);
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify token with proper secret handling
    const jwtSecret = config.jwtSecret;
    if (!jwtSecret) {
      sendError(res, "Server configuration error", 500);
      return;
    }

    const decoded = jwt.verify(token, jwtSecret as Secret) as JwtPayload;

    if (!decoded || !decoded.id) {
      sendError(res, "Invalid token payload", 401);
      return;
    }

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      sendError(res, "Authentication failed. User not found", 401);
      return;
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    sendError(res, "Authentication failed. Invalid token", 401);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Authentication required", 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Role (${req.user.role}) is not allowed to access this resource`,
        403
      );
      return;
    }

    next();
  };
};
