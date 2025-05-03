import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  authService,
  LoginCredentials,
  User,
} from "@/zustand/services/authService";
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
            set({
              requestStatus: {
                isLoading: false,
                error: error as ApiError,
              },
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
            set({
              requestStatus: {
                isLoading: false,
                error: error as ApiError,
              },
            });

            toast.error("Logout failed", {
              description: (error as ApiError).message,
            });
          }
        },

        fetchCurrentUser: async () => {
          try {
            set({ requestStatus: { isLoading: true, error: null } });
            const response = await authService.getCurrentUser();
            set({
              user: response.data,
              isAuthenticated: true,
              requestStatus: { isLoading: false, error: null },
            });
          } catch (error) {
            set({
              requestStatus: {
                isLoading: false,
                error: error as ApiError,
              },
            });

            toast.error("Failed to fetch user data", {
              description: (error as ApiError).message,
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
  ),
);
