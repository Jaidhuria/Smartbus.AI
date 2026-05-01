const express = require("express");

const {
 signup,
 login,
 googleAuth,
 sendOTP,
 verifyOTP,
 resetPassword
} = require("../controllers/authController");

const router = express.Router();

// registration
router.post("/register", signup);

// login
router.post("/login", login);

// google auth
router.post("/google", googleAuth);


// 🔐 Forgot Password Routes

// send OTP to email
router.post("/send-otp", sendOTP);

// verify OTP
router.post("/verify-otp", verifyOTP);

// reset password
router.post("/reset-password", resetPassword);

module.exports = router;