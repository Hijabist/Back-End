const { db, admin } = require("../../../firebase.js");

async function skinTonePrediction(predictionData) {
  const predictionsRef = db.collection("skin-tone");
  const snapshot = await predictionsRef
    .where("uid", "==", predictionData.uid)
    .limit(1)
    .get();

  predictionData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    await predictionsRef.doc(docId).update(predictionData);
    return docId; // Optional: return ID
  } else {
    predictionData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await predictionsRef.add(predictionData);
    return docRef.id; // Optional: return ID
  }
}

async function getSkinTonePrediction(userId) {
  const predictionsRef = db.collection("skin-tone");
  const snapshot = await predictionsRef.where("uid", "==", userId).get();

  if (snapshot.empty) {
    return [];
  }
  const result = [];
  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return result;
}

module.exports = { skinTonePrediction, getSkinTonePrediction };
