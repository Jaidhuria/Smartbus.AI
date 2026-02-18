import express from "express";
import cors from "cors";
import morgan from "morgan";

import locationRoutes from "../routes/locationRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Tracking Service is running " });
});

//!Register routes here
app.use("/api/location", locationRoutes);

export default app;
