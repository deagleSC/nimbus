import { Request, Response } from "express";
import { sendSuccess, sendError } from "../utils/apiResponse";
import axios from "axios";
import Analysis from "../models/Analysis";
import { keysToCamelCase } from "../utils/common.utils";

export const analyzeGame = async (req: Request, res: Response) => {
  const pgn = req.body.pgn;
  const color = req.body.color;
  const gameId = req.body.gameId;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!pgn || !color) {
    if (!pgn) {
      sendError(res, "PGN is required", 400);
    }
    if (!color) {
      sendError(res, "Color is required", 400);
    }
    return;
  }

  if (!openRouterKey) {
    sendError(res, "OpenRouter API key is not configured", 500);
    return;
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "system",
            content: `You are an experienced chess coach. Analyze the given game and return a JSON object with the following structure:

{
  "summary": "string", // A concise summary of the game from a coach's perspective
  "keyLearnings": ["string"], // List of key lessons to learn from this game
  "suggestions": ["string"] // List of specific suggestions for improvement
}

Keep the analysis clear and actionable, focusing on the most important aspects of the game.`,
          },
          {
            role: "user",
            content: `Analyze this game: PGN: "${pgn}", Player color: ${color}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${openRouterKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse the content from the response, handling markdown formatting
    const rawContent = response.data.choices[0].message.content;
    const jsonContent = rawContent.replace(/```json\n|\n```/g, "").trim();
    const content = keysToCamelCase(JSON.parse(jsonContent));

    // Create a new analysis document
    const analysis = new Analysis({
      gameId: gameId || null,
      id: response.data.id,
      provider: response.data.provider || "openrouter",
      modelName: response.data.model,
      object: response.data.object,
      created: response.data.created,
      choices: [
        {
          logprobs: null,
          finishReason: response.data.choices[0].finish_reason,
          nativeFinishReason: response.data.choices[0].finish_reason,
          index: 0,
          message: {
            role: "assistant",
            content: content,
            refusal: null,
            reasoning: response.data.choices[0].message.reasoning,
          },
        },
      ],
      usage: {
        promptTokens: response.data.usage.prompt_tokens,
        completionTokens: response.data.usage.completion_tokens,
        totalTokens: response.data.usage.total_tokens,
      },
    });

    // Save the analysis to the database
    await analysis.save();

    sendSuccess(res, analysis, "Game analyzed and stored successfully");
  } catch (error: any) {
    console.error(
      "Error analyzing game:",
      error.response?.data || error.message
    );
    sendError(
      res,
      "Error analyzing game",
      500,
      error.response?.data || error.message
    );
  }
};
