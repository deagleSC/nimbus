import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import config from "../config/config";
import { sendSuccess, sendError, sendAuthSuccess } from "../utils/apiResponse";

// Generate JWT token with a fixed expiration time to avoid type issues
const generateToken = (id: string, role: string): string => {
  const jwtSecret = config.jwtSecret;
  if (!jwtSecret) {
    throw new Error("JWT Secret is not defined");
  }

  // Use a hard-coded string value that matches a valid jwt expiration format
  // This avoids TypeScript type issues with the expiresIn parameter
  return jwt.sign({ id, role }, jwtSecret, { expiresIn: "7d" });
};

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, "User already exists", 400);
      return;
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Send response
    sendAuthSuccess(
      res,
      token,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Registration successful",
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    sendError(res, "Server error", 500, error);
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      sendError(res, "Invalid credentials", 401);
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, "Invalid credentials", 401);
      return;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);

    // Send response
    sendAuthSuccess(
      res,
      token,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Server error", 500, error);
  }
};

// Get current user profile
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User profile retrieved successfully"
    );
  } catch (error) {
    console.error("Get current user error:", error);
    sendError(res, "Server error", 500, error);
  }
};

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body;

    // Create update object
    const updateData: { name?: string; email?: string } = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    // Update user
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(
      res,
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "Profile updated successfully"
    );
  } catch (error) {
    console.error("Update profile error:", error);
    sendError(res, "Server error", 500, error);
  }
};

// Change password
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      sendError(res, "Current password is incorrect", 401);
      return;
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, null, "Password updated successfully");
  } catch (error) {
    console.error("Change password error:", error);
    sendError(res, "Server error", 500, error);
  }
};
