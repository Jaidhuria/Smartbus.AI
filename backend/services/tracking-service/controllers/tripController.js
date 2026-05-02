import Driver from "../models/Driver.js";
import Bus from "../models/Bus.js";
import TripLog from "../models/TripLog.js";

// POST /api/trip/start
export const startTrip = async (req, res) => {
  try {
    const { driverId, busId } = req.body;

    if (!driverId || !busId) {
      return res.status(400).json({
        success: false,
        message: "driverId and busId are required",
      });
    }

    // Check driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Check bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Prevent starting trip if already active
    if (bus.activeTripId) {
      return res.status(400).json({
        success: false,
        message: "Trip already active for this bus",
      });
    }

    // Create trip log
    const trip = await TripLog.create({
      busId: bus._id,
      driverId: driver._id,
      status: "started",
      startTime: new Date(),
    });

    // Update bus activeTripId
    bus.activeTripId = trip._id;
    await bus.save();

    return res.status(201).json({
      success: true,
      message: "Trip started successfully",
      trip,
    });
  } catch (error) {
    console.log(" startTrip error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//  POST /api/trip/end
export const endTrip = async (req, res) => {
  try {
    const { busId } = req.body;

    if (!busId) {
      return res.status(400).json({
        success: false,
        message: "busId is required",
      });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    if (!bus.activeTripId) {
      return res.status(400).json({
        success: false,
        message: "No active trip found for this bus",
      });
    }

    // Find active trip
    const trip = await TripLog.findById(bus.activeTripId);
    if (!trip) {
      // If trip missing, clear bus activeTripId
      bus.activeTripId = null;
      await bus.save();

      return res.status(404).json({
        success: false,
        message: "Active trip record not found, bus reset",
      });
    }

    // End trip
    trip.status = "ended";
    trip.endTime = new Date();
    await trip.save();

    // Clear activeTripId in bus
    bus.activeTripId = null;
    await bus.save();

    return res.status(200).json({
      success: true,
      message: "Trip ended successfully",
      trip,
    });
  } catch (error) {
    console.log(" endTrip error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/trip/active/:busId
export const getActiveTrip = async (req, res) => {
  try {
    const { busId } = req.params;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    if (!bus.activeTripId) {
      return res.status(200).json({
        success: true,
        activeTrip: null,
        message: "No active trip",
      });
    }

    const trip = await TripLog.findById(bus.activeTripId);

    return res.status(200).json({
      success: true,
      activeTrip: trip,
    });
  } catch (error) {
    console.log(" getActiveTrip error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
