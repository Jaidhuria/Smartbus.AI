const express = require("express");
const router = express.Router();
const admin = require("../utils/firebaseAdmin");

const { protect, authorize } = require("../middleware/auth");

// Set user role (ADMIN ONLY)
router.post("/set-role", protect, authorize("admin"), async (req, res) => {
  try {
    const { uid, role } = req.body;

    await admin.auth().setCustomUserClaims(uid, { role });

    // also update firestore (optional)
    await admin.firestore().collection("users").doc(uid).update({ role });

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
});

// Test admin route
router.get("/dashboard", protect, authorize("admin"), (req, res) => {
  res.send("Admin Dashboard Access");
});

module.exports = router;