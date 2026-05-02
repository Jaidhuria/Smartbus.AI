const admin = require("firebase-admin");

admin.initializeApp();

async function makeAdmin(uid) {
  await admin.auth().setCustomUserClaims(uid, { role: "admin" });
  console.log("Admin set!");
}

makeAdmin("YOUR_UID_HERE");