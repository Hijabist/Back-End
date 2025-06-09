const { db } = require("../../../firebase.js");

async function facePrediction(predictionData) {
  const docRef = db.collection("face-shape").add(predictionData);
  return docRef;
}

module.exports = { facePrediction };
