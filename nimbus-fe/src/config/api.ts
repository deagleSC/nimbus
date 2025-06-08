import { env } from "@/lib/env";

/**
 * API configuration
 * Centralized configuration for API endpoints
 */
export const API_CONFIG = {
  baseUrl: env.apiBaseUrl,
  endpoints: {
    auth: {
      login: "/auth/login",
      signup: "/auth/signup",
      logout: "/auth/logout",
      profile: "/auth/me",
      refresh: "/auth/refresh",
      changePassword: "/auth/change-password",
    },
    user: {
      profile: "/user/profile",
      update: "/user/update",
    },
    ai: {
      analyze: "/ai/analyze-game",
    },
    support: {
      request: "/support/request",
      requests: "/support/requests",
    },
  },
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

/**
 * Helper function to build full API URLs
 */
export const buildApiUrl = (path: string): string => {
  return `${API_CONFIG.baseUrl}${path}`;
};
