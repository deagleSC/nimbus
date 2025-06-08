import express from "express";
import {
  createSupportRequest,
  getSupportRequests,
} from "../controllers/support.controller";
import { authenticate } from "../middlewares/auth.middleware";
import {
  SupportRequestStatus,
  SUPPORT_REQUEST_LIMITS,
} from "../enums/support.enums";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Support
 *   description: Support request management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SupportRequest:
 *       type: object
 *       required:
 *         - userId
 *         - subject
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the support request
 *         userId:
 *           type: string
 *           description: The id of the user who submitted the request
 *         subject:
 *           type: string
 *           description: The subject of the support request
 *           minLength: ${SUPPORT_REQUEST_LIMITS.SUBJECT_MIN}
 *           maxLength: ${SUPPORT_REQUEST_LIMITS.SUBJECT_MAX}
 *         message:
 *           type: string
 *           description: The message of the support request
 *           minLength: ${SUPPORT_REQUEST_LIMITS.MESSAGE_MIN}
 *           maxLength: ${SUPPORT_REQUEST_LIMITS.MESSAGE_MAX}
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, RESOLVED]
 *           description: The status of the support request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the support request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the support request was last updated
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         userId: 60d21b4667d0d8992e610c85
 *         subject: "Need help with account"
 *         message: "I cannot log in to my account."
 *         status: "PENDING"
 *         createdAt: "2023-06-22T14:56:59.301Z"
 *         updatedAt: "2023-06-22T14:56:59.301Z"
 */

/**
 * @swagger
 * /api/support/request:
 *   post:
 *     summary: Create a new support request
 *     tags: [Support]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *                 description: The subject of the support request (${SUPPORT_REQUEST_LIMITS.SUBJECT_MIN}-${SUPPORT_REQUEST_LIMITS.SUBJECT_MAX} characters)
 *                 minLength: ${SUPPORT_REQUEST_LIMITS.SUBJECT_MIN}
 *                 maxLength: ${SUPPORT_REQUEST_LIMITS.SUBJECT_MAX}
 *                 example: "Need help with email change"
 *               message:
 *                 type: string
 *                 description: Detailed message explaining the support request (${SUPPORT_REQUEST_LIMITS.MESSAGE_MIN}-${SUPPORT_REQUEST_LIMITS.MESSAGE_MAX} characters)
 *                 minLength: ${SUPPORT_REQUEST_LIMITS.MESSAGE_MIN}
 *                 maxLength: ${SUPPORT_REQUEST_LIMITS.MESSAGE_MAX}
 *                 example: "I need to change my email address as I no longer have access to the current one."
 *     responses:
 *       201:
 *         description: Support request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Support request submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/SupportRequest'
 *       400:
 *         description: Bad request - Invalid input (e.g., message too short/long)
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/support/requests:
 *   get:
 *     summary: Get user's support requests
 *     tags: [Support]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's support requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SupportRequest'
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */

// All support routes require authentication
router.use(authenticate);

// Create a new support request
router.post("/request", createSupportRequest);

// Get user's support requests
router.get("/requests", getSupportRequests);

export default router;
