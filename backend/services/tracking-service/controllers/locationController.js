import LiveLocation from "../models/LiveLocation.js";

// POST /api/location/update
export const updateLocation = async (req, res) => {
  try {
    const { busId, lat, lng, speed } = req.body;

    if (!busId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "busId, lat, lng are required",
      });
    }

    const location = await LiveLocation.create({
      busId,
      lat,
      lng,
      speed: speed || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Location updated successfully",
      location,
    });
  } catch (error) {
    console.log(" updateLocation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/location/latest/:busId
export const getLatestLocationByBus = async (req, res) => {
  try {
    const { busId } = req.params;

    const latest = await LiveLocation.findOne({ busId }).sort({ timestamp: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No location found for this bus",
      });
    }

    return res.status(200).json({
      success: true,
      latest,
    });
  } catch (error) {
    console.log(" getLatestLocationByBus error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
