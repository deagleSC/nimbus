import { Request, Response } from "express";
import { SupportRequest } from "../models/support.model";
import { sendError } from "../utils/apiResponse";

export const createSupportRequest = async (req: Request, res: Response) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    // Check if user is logged in and has appropriate role
    if (!userRole || !["user", "admin"].includes(userRole)) {
      return sendError(res, "Unauthorized access", 403);
    }

    const supportRequest = new SupportRequest({
      userId,
      subject,
      message,
    });

    await supportRequest.save();

    res.status(201).json({
      success: true,
      data: supportRequest,
      message: "Support request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating support request:", error);
    sendError(res, "Failed to submit support request", 500);
  }
};

export const getSupportRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }

    // If user is admin, they can see all requests
    // Otherwise, users can only see their own requests
    const query = userRole === "admin" ? {} : { userId };

    const supportRequests = await SupportRequest.find(query)
      .sort({ createdAt: -1 })
      .select("-__v")
      .populate("userId", "name email"); // Include user details in response

    res.status(200).json({
      success: true,
      data: supportRequests,
    });
  } catch (error) {
    console.error("Error fetching support requests:", error);
    sendError(res, "Failed to fetch support requests", 500);
  }
};
