import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authService } from "@/zustand/services/authService";
import { LoginCredentials, User } from "@/zustand/types";
import { ApiError, RequestStatus } from "@/zustand/types";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  requestStatus: RequestStatus;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  clearErrors: () => void;
}

// Combine state and actions
type AuthStore = AuthState & AuthActions;

// Create the store
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        requestStatus: {
          isLoading: false,
          error: null,
        },

        // Actions
        login: async (credentials: LoginCredentials) => {
          try {
            set({ requestStatus: { isLoading: true, error: null } });
            const response = await authService.login(credentials);

            // Store token in localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem("token", response.data.token);
            }

            set({
              user: response.data.data.user,
              token: response.data.token,
              isAuthenticated: true,
              requestStatus: { isLoading: false, error: null },
            });
          } catch (error) {
            // Extract the error message from the API error
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
              // If we get here, it means something is wrong with our error handling
              // Log this as it should not happen in production
              console.error("Unhandled error format:", error);
              errorMessage = "Login failed";
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

            // Show toast immediately for better user feedback
            toast.error("Login failed", {
              description: errorMessage,
            });
          }
        },

        logout: async () => {
          try {
            set({ requestStatus: { isLoading: true, error: null } });
            await authService.logout();

            // Remove token from localStorage
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
            }

            set({
              user: null,
              token: null,
              isAuthenticated: false,
              requestStatus: { isLoading: false, error: null },
            });

            toast.success("Logged out", {
              description: "You have been logged out successfully.",
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
              console.error("Unhandled logout error format:", error);
              errorMessage = "Logout process failed";
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

            toast.error("Logout failed", {
              description: errorMessage,
            });
          }
        },

        fetchCurrentUser: async () => {
          try {
            set({ requestStatus: { isLoading: true, error: null } });
            const response = await authService.getCurrentUser();
            set({
              user: response.data.data,
              isAuthenticated: true,
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
              console.error("Unhandled user fetch error format:", error);
              errorMessage = "Could not retrieve user data";
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

            toast.error("Failed to fetch user data", {
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
      {
        name: "auth-storage",
        // Only persist these fields
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "auth-store" },
  ),
);
