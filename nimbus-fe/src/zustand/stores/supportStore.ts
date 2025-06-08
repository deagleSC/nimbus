import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { supportService } from "@/zustand/services/supportService";
import { ApiError, RequestStatus } from "@/zustand/types";
import { SupportRequest } from "@/app/support/my-requests/columns";
import { toast } from "sonner";

interface SupportState {
  requests: SupportRequest[];
  requestStatus: RequestStatus;
}

interface SupportActions {
  fetchRequests: () => Promise<void>;
  createRequest: (data: { subject: string; message: string }) => Promise<void>;
  clearErrors: () => void;
}

// Combine state and actions
type SupportStore = SupportState & SupportActions;

// Create the store
export const useSupportStore = create<SupportStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      requests: [],
      requestStatus: {
        isLoading: false,
        error: null,
      },

      // Actions
      fetchRequests: async () => {
        try {
          set({ requestStatus: { isLoading: true, error: null } });
          const response = await supportService.getRequests();
          set({
            requests: response.data.data,
            requestStatus: { isLoading: false, error: null },
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
            console.error(
              "Unhandled support requests fetch error format:",
              error,
            );
            errorMessage = "Failed to fetch support requests";
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
          });

          toast.error("Failed to fetch support requests", {
            description: errorMessage,
          });
        }
      },

      createRequest: async (data: { subject: string; message: string }) => {
        try {
          set({ requestStatus: { isLoading: true, error: null } });
          const response = await supportService.createRequest(data);
          set((state) => ({
            requests: [response.data.data, ...state.requests],
            requestStatus: { isLoading: false, error: null },
          }));
          toast.success("Support request submitted", {
            description: "We'll get back to you as soon as possible.",
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
            console.error(
              "Unhandled support request creation error format:",
              error,
            );
            errorMessage = "Failed to submit support request";
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
          });

          toast.error("Failed to submit support request", {
            description: errorMessage,
          });
        }
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
    { name: "support-store" },
  ),
);
