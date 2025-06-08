import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { aiService } from "@/zustand/services/aiService";
import { ApiError, RequestStatus } from "@/zustand/types";
import { toast } from "sonner";

interface AIState {
  analysis: unknown;
  requestStatus: RequestStatus;
  isAnalyzing: boolean;
}

interface AIActions {
  analyzeGame: (
    pgn: string,
    color: string,
    gameId: string,
    userId: string,
  ) => Promise<void>;
  clearAnalysis: () => void;
  clearErrors: () => void;
}

// Combine state and actions
type AIStore = AIState & AIActions;

// Create the store
export const useAIStore = create<AIStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      analysis: null,
      requestStatus: {
        isLoading: false,
        error: null,
      },
      isAnalyzing: false,

      // Actions
      analyzeGame: async (
        pgn: string,
        color: string,
        gameId: string,
        userId: string,
      ) => {
        try {
          set({
            isAnalyzing: true,
            requestStatus: { isLoading: true, error: null },
          });
          const response = await aiService.analyze(pgn, color, gameId, userId);

          set({
            analysis: response.data,
            requestStatus: { isLoading: false, error: null },
            isAnalyzing: false,
          });
        } catch (error) {
          // Extract error message
          let errorMessage: string;

          if (
            error &&
            typeof error === "object" &&
            "message" in error &&
            typeof error.message === "string"
          ) {
            errorMessage = error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          } else {
            console.error("Unhandled analysis error format:", error);
            errorMessage = "Game analysis failed";
          }

          set({
            requestStatus: {
              isLoading: false,
              error: {
                message: errorMessage,
                status: (error as ApiError)?.status,
                code: (error as ApiError)?.code,
              },
            },
            isAnalyzing: false,
          });

          toast.error("Analysis failed", {
            description: errorMessage,
          });
        }
      },

      clearAnalysis: () => {
        set({
          analysis: null,
          requestStatus: {
            ...get().requestStatus,
            error: null,
          },
          isAnalyzing: false,
        });
      },

      clearErrors: () => {
        set({
          requestStatus: {
            ...get().requestStatus,
            error: null,
          },
        });
      },
    }),
    { name: "ai-store" },
  ),
);
