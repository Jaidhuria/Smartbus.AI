import Driver from "../models/Driver.js";
import jwt from "jsonwebtoken";

// 🔹 Generate Token
const generateToken = (driverId) => {
  return jwt.sign(
    { driverId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🔹 Register Driver (Admin Use)
export const registerDriver = async (req, res) => {
  try {
    const { name, phone, password, licenseNo } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password required",
      });
    }

    const existingDriver = await Driver.findOne({ phone });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver already exists",
      });
    }

    const driver = await Driver.create({
      name,
      phone,
      password,
      licenseNo,
    });

    res.status(201).json({
      success: true,
      message: "Driver registered successfully",
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
      },
    });

  } catch (error) {
    console.log("registerDriver error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// 🔹 Login Driver
export const loginDriver = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password required",
      });
    }

    const driver = await Driver.findOne({ phone }).select("+password");

    if (!driver) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await driver.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(driver._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      driver: {
        id: driver._id,
        name: driver.name,
        phone: driver.phone,
      },
    });

  } catch (error) {
    console.log("loginDriver error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};