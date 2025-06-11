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
  const faceShapeDoc = await db.collection("face-shape").doc(uid).get();
  return faceShapeDoc.exists ? faceShapeDoc.data() : null;
}

async function getSkinToneByUid(uid) {
  const skinToneDoc = await db.collection("skin-tone").doc(uid).get();
  return skinToneDoc.exists ? skinToneDoc.data() : null;
}

module.exports = {
  createUser,
  getUserByUid,
  getFaceShapeByUid,
  getSkinToneByUid,
};