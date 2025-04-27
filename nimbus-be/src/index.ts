#!/usr/bin/env node

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import config from "./config/config";
import swaggerSpec from "./config/swagger";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";

// Connect to MongoDB
connectDB();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Welcome to Nimbus API" });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error:", err);
  res
    .status(500)
    .json({ success: false, message: "Server error", error: err.message });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger API Documentation: http://localhost:${PORT}/api-docs`);
});
