import express from "express";
import { startTrip, endTrip, getActiveTrip } from "../controllers/tripController.js";

import { protectDriver } from "../middleware/authMiddleware.js";

router.post("/start", protectDriver, startTrip);
router.post("/end", protectDriver, endTrip);

const router = express.Router();

//! Start trip
router.post("/start", startTrip);

//!? End trip
router.post("/end", endTrip);

//! Get active trip for a bus
router.get("/active/:busId", getActiveTrip);

export default router;
