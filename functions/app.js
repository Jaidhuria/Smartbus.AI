const express = require("express");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();
app.use(express.json());

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded; // contains uid + role
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// 👤 Normal route
app.get("/user", protect, (req, res) => {
  res.json({ message: "User access", user: req.user });
});

// 👑 Admin route
app.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

app.listen(5000, () => console.log("Server running on 5000"));