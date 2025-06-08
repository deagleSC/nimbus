import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { analyzeGame } from "../controllers/ai.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-powered game analysis endpoints
 */

/**
 * @swagger
 * /api/ai/analyze-game:
 *   post:
 *     summary: Analyze a chess game using AI
 *     tags: [AI]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pgn
 *               - color
 *               - userId
 *             properties:
 *               pgn:
 *                 type: string
 *                 description: PGN notation of the chess game
 *                 example: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"
 *               color:
 *                 type: string
 *                 description: Player's color to analyze for
 *                 enum: [white, black]
 *                 example: "white"
 *               gameId:
 *                 type: string
 *                 description: Optional ID of the game being analyzed
 *                 example: "game_123"
 *               userId:
 *                 type: string
 *                 description: ID of the user requesting the analysis
 *                 example: "user_123"
 *     responses:
 *       200:
 *         description: Game analysis completed successfully
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
 *                   example: Game analyzed and stored successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     analysis:
 *                       type: object
 *                       properties:
 *                         summary:
 *                           type: string
 *                           description: A concise summary of the game from a coach's perspective
 *                           example: "White played a solid game but missed a tactical opportunity in the middlegame"
 *                         keyLearnings:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: List of key lessons to learn from this game
 *                           example: ["Control the center early", "Watch for tactical opportunities", "Keep pieces coordinated"]
 *                         suggestions:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: List of specific suggestions for improvement
 *                           example: ["Practice tactical puzzles", "Study basic endgame positions", "Review opening principles"]
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "PGN is required"
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Server error
 */
router.post("/analyze-game", authenticate, analyzeGame);

export default router;
