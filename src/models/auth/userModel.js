const { db } = require("../../../firebase.js");

async function createUser(userData) {
  await db.collection("users").doc(userData.uid).set(userData);
  return userData;
}

async function getUserByUid(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
}

module.exports = { createUser, getUserByUid };
