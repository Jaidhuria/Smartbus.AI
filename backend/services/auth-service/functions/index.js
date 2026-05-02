const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.api = functions.https.onRequest(require("./src/app"));

// Auto-create user doc on signup
exports.createUserDoc = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();

  await db.collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    role: "user", // default role
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});