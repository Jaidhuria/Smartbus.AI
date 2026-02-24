import jwt from "jsonwebtoken";
import Driver from "../models/Driver.js";

export const protectDriver = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const driver = await Driver.findById(decoded.driverId);

    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Driver not found",
      });
    }

    req.driver = driver;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
