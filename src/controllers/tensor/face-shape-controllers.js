const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { predict } = require("../../models/tensor/tf-models");
const { admin, db } = require("../../../firebase.js"); // Import Firestore instance

async function predictFaceShape(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: true,
      message: "No image file provided.",
    });
  }

  try {
    // 1. Baca file image
    const imageBuffer = fs.readFileSync(req.file.path);

    // 2. Prediksi face shape
    const rawOutput = await predict(imageBuffer);
    const faceShapeClasses = ["round", "heart", "square", "oblong", "oval"];

    // 3. Cari kelas dengan probabilitas tertinggi
    let maxProbability = 0;
    let predictedFaceShape = "";
    rawOutput.forEach((probability, index) => {
      if (probability > maxProbability) {
        maxProbability = probability;
        predictedFaceShape = faceShapeClasses[index];
      }
    });

    // 4. Simpan probabilitas per kelas
    const probabilitiesByClass = {};
    faceShapeClasses.forEach((className, index) => {
      probabilitiesByClass[className] = {
        probability: rawOutput[index],
        percentage: (rawOutput[index] * 100).toFixed(2) + "%",
      };
    });

    // 5. Hapus file image
    fs.unlinkSync(req.file.path);

    // 6. Panggil python untuk rekomendasi hijab
    const predictedFaceShapePython = predictedFaceShape.toUpperCase();
    const pythonScriptPath = path.join(
      __dirname,
      "../../pythonScripts/stylehijap.py"
    );
    const pythonProcess = spawn("python", [
      pythonScriptPath,
      predictedFaceShapePython,
    ]);

    let pythonOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
      let hijabRecomendation = {};
      try {
        hijabRecomendation = JSON.parse(pythonOutput);
      } catch (error) {
        console.error("Error parsing Python output:", error);
        hijabRecomendation = { error: "Failed to parse Python output." };
      }

      // ====== SIMPAN / UPDATE KE FIRESTORE ======
      try {
        // Pastikan sudah login (validasi token jalan)
        const userId = req.user && req.user.uid;
        if (!userId) throw new Error("User not authenticated.");

        const predictionsRef = db.collection("predictions");
        // Cek apakah sudah ada prediksi user ini (boleh pake filter lain, misal tanggal)
        const snapshot = await predictionsRef
          .where("uid", "==", userId)
          .limit(1)
          .get();

        const predictionData = {
          uid: userId,
          predicted_face_shape: predictedFaceShape,
          confidence: maxProbability,
          all_probabilities: probabilitiesByClass,
          raw_prediction: rawOutput,
          hijabRecomendation: hijabRecomendation,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (!snapshot.empty) {
          // Update dokumen prediksi yang sudah ada
          const docId = snapshot.docs[0].id;
          await predictionsRef.doc(docId).update(predictionData);
        } else {
          // Tambah dokumen prediksi baru
          predictionData.createdAt =
            admin.firestore.FieldValue.serverTimestamp();
          await predictionsRef.add(predictionData);
        }
      } catch (e) {
        console.error("Firestore error:", e);
        // Tidak mengganggu response utama
      }

      // ====== END SIMPAN / UPDATE FIRESTORE ======

      res.json({
        error: false,
        message: "Face shape prediction successful.",
        result: {
          predicted_face_shape: predictedFaceShape,
          confidence: (maxProbability * 100).toFixed(2) + "%",
          confidence_raw: maxProbability,
          all_probabilities: probabilitiesByClass,
          raw_prediction: rawOutput,
          hijabRecomendation: hijabRecomendation,
        },
      });
    });
  } catch (error) {
    console.error("Prediction error:", error);
    try {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError);
    }
    res.status(500).json({
      error: true,
      message: error.message || "An error occurred during prediction.",
    });
  }
}

module.exports = { predictFaceShape };
