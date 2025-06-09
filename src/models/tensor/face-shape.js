const { db, admin } = require("../../../firebase.js");

// Pilihan: Hanya 1 prediksi per user, update jika sudah ada
async function facePrediction(predictionData) {
  const predictionsRef = db.collection("face-shape");
  const snapshot = await predictionsRef
    .where("uid", "==", predictionData.uid)
    .limit(1)
    .get();

  predictionData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

  if (!snapshot.empty) {
    // Update dokumen yang sudah ada
    const docId = snapshot.docs[0].id;
    await predictionsRef.doc(docId).update(predictionData);
    return docId; // Optional: return ID
  } else {
    // Tambah dokumen baru
    predictionData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await predictionsRef.add(predictionData);
    return docRef.id; // Optional: return ID
  }
}

async function getUserFacePredictions(userId) {
  const predictionsRef = db.collection("face-shape");
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

module.exports = { facePrediction, getUserFacePredictions };
