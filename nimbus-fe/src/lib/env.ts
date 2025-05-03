/**
 * Environment configuration with fallbacks
 */

export const env = {
  /**
   * API Configuration
   */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,

  /**
   * Application Configuration
   */
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Nimbus",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  /**
   * Environment Configuration
   */
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
};
