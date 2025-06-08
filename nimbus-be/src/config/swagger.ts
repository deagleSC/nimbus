import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import config from "./config";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Nimbus API Documentation",
    version: "1.0.0",
    description: "API documentation for the Nimbus backend",
    license: {
      name: "ISC",
      url: "https://opensource.org/licenses/ISC",
    },
    contact: {
      name: "Nimbus Team",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: "Development server",
    },
    {
      url: process.env.API_URL || "https://nimbus-be.vercel.app",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

// Using non-glob patterns for TypeScript compilation
// The actual files will be loaded at runtime by swagger-jsdoc
const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [
    // These paths are relative to where the app is run
    "./dist/routes/*.js",
    "./dist/models/*.js",
    // For development with ts-node
    "./src/routes/*.ts",
    "./src/models/*.ts",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
