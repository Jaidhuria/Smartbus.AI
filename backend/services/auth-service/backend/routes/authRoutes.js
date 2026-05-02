const express = require("express");
const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const {
 signup,
 login,
 googleAuth,
 sendOTP,
 verifyOTP,
 resetPassword,
 getProfile,
 updateProfile
} = require("../controllers/authController");

const {
 getAllUsers,
 getUserById,
 updateUserRole,
 toggleUserStatus,
 deleteUser
} = require("../controllers/adminFunctions");

const router = express.Router();

// Public routes
router.post("/register", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin only routes
router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/users/:id", protect, authorize("admin"), getUserById);
router.put("/users/:id/role", protect, authorize("admin"), updateUserRole);
router.put("/users/:id/status", protect, authorize("admin"), toggleUserStatus);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

module.exports = router;