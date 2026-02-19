import express from "express";
import { startTrip, endTrip, getActiveTrip } from "../controllers/tripController.js";

const router = express.Router();

//! Start trip
router.post("/start", startTrip);

//!? End trip
router.post("/end", endTrip);

//! Get active trip for a bus
router.get("/active/:busId", getActiveTrip);

export default router;
