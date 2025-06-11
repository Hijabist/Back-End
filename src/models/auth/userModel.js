const { db } = require("../../../firebase.js");

async function createUser(userData) {
  await db.collection("users").doc(userData.uid).set(userData);
  return userData;
}

async function getUserByUid(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
}

async function getFaceShapeByUid(uid) {
  const snapshot = await db
    .collection("face-shape")
    .where("uid", "==", uid)
    .get();
  if (snapshot.empty) return null;
  // Kalau cuma mau satu, ambil yang pertama:
  return snapshot.docs[0].data();
}

async function getSkinToneByUid(uid) {
  const snapshot = await db
    .collection("skin-tone")
    .where("uid", "==", uid)
    .get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data();
}

module.exports = {
  createUser,
  getUserByUid,
  getFaceShapeByUid,
  getSkinToneByUid,
};
