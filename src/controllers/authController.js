// user to convert in student ....

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const {OAuth2Client} = require("google-auth-library");
const User = require("../models/user");

// Import admin functions
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} = require("./adminFunctions");

// create a client instance once; require client id from env
if (!process.env.GOOGLE_CLIENT_ID) {
  console.error("WARNING: GOOGLE_CLIENT_ID is not set in environment variables.");
} else {
  console.log("Google client ID loaded (first 10 chars):", process.env.GOOGLE_CLIENT_ID.slice(0,10));
}
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
exports.signup = async (req, res) => {
  try {
    const { name, email, password, captchaToken, role } = req.body;

    // Captcha check is disabled for now to avoid blocking requests
    // if (!captchaToken)
    //   return res.status(400).json({ message: "Captcha required" });

    // Verify Captcha
    // const captchaVerify = await axios.post(
    //   "https://www.google.com/recaptcha/api/siteverify",
    //   null,
    //   {
    //     params: {
    //       secret: process.env.RECAPTCHA_SECRET,
    //       response: captchaToken,
    //     },
    //   }
    // );

    // if (!captchaVerify.data.success)
    //   return res.status(400).json({ message: "Captcha failed" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const publicRoles = ["user", "student"];
    const assignedRole = publicRoles.includes(role) ? role : "user";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// handle google token sent from frontend
exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("googleAuth called, token length", token ? token.length : "none");
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("googleAuth called but GOOGLE_CLIENT_ID is missing");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // verify id token with google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // existing user, make sure googleId is stored
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name,
        email,
        googleId,
        password: hashedPassword,
        role: "user", // Default role for Google auth
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Google authentication failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    // Captcha check is disabled for now to avoid blocking requests
    // if (!captchaToken)
    //   return res.status(400).json({ message: "Captcha required" });

    // const captchaVerify = await axios.post(
    //   "https://www.google.com/recaptcha/api/siteverify",
    //   null,
    //   {
    //     params: {
    //       secret: process.env.RECAPTCHA_SECRET,
    //       response: captchaToken,
    //     },
    //   }
    // );

    // if (!captchaVerify.data.success)
    //   return res.status(400).json({ message: "Captcha failed" });

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
const otpGenerator = require("otp-generator");
const transporter = require("../config/mailer");

let otpStore = {};


// SEND OTP
exports.sendOTP = async (req, res) => {

 const { email } = req.body;

 try {

  const user = await User.findOne({ email });

  if (!user) {
   return res.status(404).json({ message: "User not found" });
  }

  const otp = otpGenerator.generate(6, {
   upperCaseAlphabets: false,
   lowerCaseAlphabets: false,
   specialChars: false,
  });

  otpStore[email] = otp;

  await transporter.sendMail({
   from: process.env.EMAIL,
   to: email,
   subject: "Password Reset OTP",
   text: `SmartBus: Your verification code is ${otp}. Do not share this code with anyone.`
  });

  res.json({
   message: "OTP sent successfully"
  });

 } catch (error) {

  res.status(500).json({
   message: "Server error"
  });

 }

};


// VERIFY OTP
exports.verifyOTP = (req, res) => {

 const { email, otp } = req.body;

 if (otpStore[email] === otp) {

  return res.json({
   message: "OTP verified"
  });

 }

 res.status(400).json({
  message: "Invalid OTP"
 });

};


// RESET PASSWORD
exports.resetPassword = async (req, res) => {

 const { email, password } = req.body;

 try {

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.updateOne(
   { email },
   { password: hashedPassword }
  );

  delete otpStore[email];

  res.json({
   message: "Password updated successfully"
  });

 } catch (error) {

  res.status(500).json({
   message: "Server error"
  });

 }

};

// USER PROFILE FUNCTIONS

// Get user profile (Authenticated users)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile (Authenticated users)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
