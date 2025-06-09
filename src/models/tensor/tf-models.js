const tf = require("@tensorflow/tfjs"); // Menggunakan tfjs biasa
const { Jimp } = require("jimp"); // Pastikan sudah install: npm install jimp

let model;

// Load model dari HTTP URL
async function loadModel() {
  if (!model) {
    try {
      // Model harus diakses via URL
      model = await tf.loadGraphModel(
        "https://back-end-production-f224.up.railway.app/modeltfjs/face-shape/model.json"
      );
      console.log("Model loaded successfully.");

      // Debug: Print model information
      console.log("Model inputs:", model.inputs);
      console.log("Model outputs:", model.outputs);

      // Cek input shape yang diharapkan
      if (model.inputs && model.inputs.length > 0) {
        console.log("Expected input shape:", model.inputs[0].shape);
      }
    } catch (error) {
      console.error("Error loading model:", error);
      throw error;
    }
  }
  return model;
}

// Preprocess gambar menggunakan Jimp
async function preprocessImage(imageBuffer) {
  try {
    // Read image dengan Jimp
    const image = await Jimp.read(imageBuffer);

    // Resize ke ukuran yang diharapkan model (224x224)
    // Untuk Jimp versi terbaru, gunakan object parameter
    await image.resize({ w: 224, h: 224 });

    // Convert ke RGB (hilangkan alpha channel jika ada)
    const { data, width, height } = image.bitmap;

    // Buat array untuk RGB saja (tanpa alpha)
    const rgbData = new Float32Array(width * height * 3);

    for (let i = 0; i < width * height; i++) {
      const pixelIndex = i * 4; // RGBA
      const rgbIndex = i * 3; // RGB

      // Normalisasi nilai pixel ke range [0, 1]
      rgbData[rgbIndex] = data[pixelIndex] / 255.0; // R
      rgbData[rgbIndex + 1] = data[pixelIndex + 1] / 255.0; // G
      rgbData[rgbIndex + 2] = data[pixelIndex + 2] / 255.0; // B
    }

    // Buat tensor dengan shape [1, 224, 224, 3] (batch_size, height, width, channels)
    const tensor = tf.tensor4d(rgbData, [1, height, width, 3]);

    console.log("Preprocessed tensor shape:", tensor.shape);
    return tensor;
  } catch (error) {
    console.error("Error preprocessing image:", error);
    throw error;
  }
}

// Fungsi untuk melakukan prediksi
async function predict(imageBuffer) {
  try {
    // Load model jika belum di-load
    await loadModel();

    // Preprocess image
    const preprocessedImage = await preprocessImage(imageBuffer);

    console.log("Input tensor shape:", preprocessedImage.shape);

    let prediction;

    // Coba beberapa cara berbeda untuk predict
    try {
      // Method 1: Coba dengan array input (paling umum untuk GraphModel)
      console.log("Trying method 1: Array input");
      prediction = model.predict([preprocessedImage]);
    } catch (error1) {
      console.log("Method 1 failed, trying method 2");

      try {
        // Method 2: Coba dengan tensor langsung
        console.log("Trying method 2: Direct tensor input");
        prediction = model.predict(preprocessedImage);
      } catch (error2) {
        console.log("Method 2 failed, trying method 3");

        try {
          // Method 3: Coba dengan named input object
          console.log("Trying method 3: Named input object");
          const inputObject = { input_layer: preprocessedImage };
          prediction = model.predict(inputObject);
        } catch (error3) {
          console.log("Method 3 failed, trying method 4");

          // Method 4: Coba dengan execute() instead of predict()
          console.log("Trying method 4: Using execute()");
          const inputObject = { input_layer: preprocessedImage };
          prediction = model.execute(inputObject);
        }
      }
    }

    // Ambil hasil prediksi
    let result, resultArray;

    if (Array.isArray(prediction)) {
      // Jika hasil adalah array of tensors
      result = await prediction[0].data();
      resultArray = Array.from(result);

      // Cleanup prediction tensors
      prediction.forEach((tensor) => tensor.dispose());
    } else {
      // Jika hasil adalah single tensor
      result = await prediction.data();
      resultArray = Array.from(result);

      // Cleanup prediction tensor
      prediction.dispose();
    }

    // Cleanup input tensor
    preprocessedImage.dispose();

    console.log("Prediction result:", resultArray);
    return resultArray;
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}

// Fungsi untuk cleanup model (opsional)
function disposeModel() {
  if (model) {
    model.dispose();
    model = null;
    console.log("Model disposed successfully.");
  }
}

// Fungsi untuk mendapatkan informasi model
async function getModelInfo() {
  await loadModel();
  return {
    inputs: model.inputs,
    outputs: model.outputs,
    signature: model.modelSignature || null,
  };
}

module.exports = {
  loadModel,
  preprocessImage,
  predict,
  disposeModel,
  getModelInfo,
};
