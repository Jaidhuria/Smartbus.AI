//! location route for live location
import express from "express";
import {
  updateLocation,
  getLatestLocationByBus,
} from "../controllers/locationController.js";

const router = express.Router();

// ✅ POST: Driver sends live location
router.post("/update", updateLocation);

// ✅ GET: Admin/Student fetch latest location of a bus
router.get("/latest/:busId", getLatestLocationByBus);

export default router;
