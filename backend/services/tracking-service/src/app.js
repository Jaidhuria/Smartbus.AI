// ** Tracking Service - Express App Setup
import express from "express";
import cors from "cors";
import morgan from "morgan";
import locationRoutes from "../routes/locationRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Test route - Health Check
app.get("/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Tracking Service is running",
    timestamp: new Date().toISOString()
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "Welcome to Tracking Service API",
    endpoints: {
      health: "/health",
      location: "/api/location/update (POST)",
      getLocation: "/api/location/latest/:busId (GET)"
    }
  });
});

// Register routes here
app.use("/api/location", locationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

export default app;
