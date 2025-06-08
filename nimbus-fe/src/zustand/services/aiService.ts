import { apiRequest } from "@/zustand/utils/api.utils";
import { ApiResponse } from "@/zustand/types";
import { API_CONFIG } from "@/config/api";

export const aiService = {
  analyze: async (
    pgn: string,
    color: string,
    gameId: string,
    userId: string,
  ): Promise<ApiResponse<unknown>> => {
    return apiRequest<unknown>({
      method: "POST",
      url: API_CONFIG.endpoints.ai.analyze,
      data: {
        pgn,
        color,
        gameId,
        userId,
      },
      timeout: 0,
    });
  },
};
