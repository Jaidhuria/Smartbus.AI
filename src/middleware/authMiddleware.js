const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {

    token = req.headers.authorization.split(" ")[1];

    try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token and attach to req
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Check if user has required role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

// Check if user is active
const isActive = (req, res, next) => {
  if (req.user && req.user.isActive) {
    next();
  } else {
    res.status(403).json({ message: "Account is deactivated" });
  }
};

module.exports = { protect, authorize, isAdmin, isActive };