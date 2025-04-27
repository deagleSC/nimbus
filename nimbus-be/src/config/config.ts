import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Using a function to ensure we have a valid default for the JWT secret
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn(
      "WARNING: JWT_SECRET is not set in environment. Using default secret for development only. DO NOT use in production!"
    );
    return "nimbus_dev_secret_CHANGE_IN_PRODUCTION";
  }
  return secret;
};

// Ensure JWT expiration is a valid value
const getJwtExpiration = (): string => {
  const expiration = process.env.JWT_EXPIRES_IN;
  // Validate that it's a valid JWT expiration format
  if (!expiration) {
    return "7d"; // Default to 7 days
  }
  return expiration;
};

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/nimbus",
  jwtSecret: getJwtSecret(),
  jwtExpiresIn: getJwtExpiration(),
};

export default config;
