const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { predict } = require("../../models/tensor/skin-tone-models");
const {
  skinTonePrediction,
  getSkinTonePrediction,
} = require("../../models/tensor/skinTonePredictions");

async function predictSkinTone(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: true,
      message: "No image file provided.",
    });
  }

  try {
    const imageBuffer = fs.readFileSync(req.file.path);
    const result = await predict(imageBuffer);

    // Skin tone classes (samakan dengan model kamu)
    const skinToneClasses = ["dark", "light", "mid_dark", "mid_light"];
    let maxProbability = 0;
    let predictedSkinTone = "";
    result.forEach((prob, idx) => {
      if (prob > maxProbability) {
        maxProbability = prob;
        predictedSkinTone = skinToneClasses[idx];
      }
    });

    // Hapus file sementara
    fs.unlinkSync(req.file.path);

    // === Panggil Python ===
    const pythonPath = "python"; // Atau python3, sesuaikan env kamu
    const scriptPath = path.join(__dirname, "../../pythonScripts/warna.py");

    const py = spawn(pythonPath, [scriptPath, predictedSkinTone]);

    let pyResult = "";
    py.stdout.on("data", (data) => {
      pyResult += data.toString();
    });
    py.stderr.on("data", (data) => {
      console.error("Python error:", data.toString());
    });

    // Jadikan 'close' handler-nya async supaya bisa pakai await skinTonePrediction
    py.on("close", async (code) => {
      let recommendation = {};
      try {
        recommendation = JSON.parse(pyResult);
      } catch (e) {
        recommendation = { error: "Failed to parse Python output." };
      }

      try {
        const userId = req.user && req.user.uid;
        if (!userId) throw new Error("User ID not found in request.");

        await skinTonePrediction({
          uid: userId,
          skin_tone: predictedSkinTone,
          color_recommendation: recommendation,
        });

        // Success response setelah Firestore OK
        return res.json({
          error: false,
          message: "Skin tone prediction successful.",
          skinTone: predictedSkinTone,
          result: {
            color_recommendation: recommendation,
          },
        });
      } catch (error) {
        console.error("Error saving skin tone prediction:", error);
        return res.status(500).json({
          error: true,
          message: "Failed to save skin tone prediction.",
        });
      }
    });
  } catch (error) {
    try {
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (_) {}

    res.status(500).json({
      error: true,
      message: error.message || "An error occurred during prediction.",
    });
  }
}

async function getUserSkinTonePredictions(req, res) {
  try {
    const userId = req.user && req.user.uid;
    if (!userId)
      return res.status(401).json({
        error: true,
        message: "User not authenticated.",
      });

    const prediction = await getSkinTonePrediction(userId);

    res.json({
      error: false,
      message: "Skin tone predictions retrieved successfully.",
      result: prediction,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message:
        error.message || "An error occurred while retrieving predictions.",
    });
  }
}

module.exports = { predictSkinTone, getUserSkinTonePredictions };
