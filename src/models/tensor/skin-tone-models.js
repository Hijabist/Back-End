const tf = require("@tensorflow/tfjs");
const { Jimp } = require("jimp"); // pastikan sudah install jimp

let model;

// Load model dari HTTP URL (ganti path modelmu!)
async function loadModel() {
  if (!model) {
    try {
      model = await tf.loadGraphModel(
        "http://localhost:3000/modeltfjs/skin-tone/model.json"
      );
      console.log("Skin-tone model loaded successfully.");
      console.log("Model inputs:", model.inputs);
      console.log("Model outputs:", model.outputs);

      if (model.inputs && model.inputs.length > 0) {
        console.log("Expected input shape:", model.inputs[0].shape);
      }
    } catch (error) {
      console.error("Error loading skin-tone model:", error);
      throw error;
    }
  }
  return model;
}

async function preprocessImage(imageBuffer) {
  try {
    const image = await Jimp.read(imageBuffer);

    // Contoh: resize ke 224x224. Jika modelmu beda, ganti di sini
    await image.resize({ w: 224, h: 224 });

    const { data, width, height } = image.bitmap;
    const rgbData = new Float32Array(width * height * 3);

    for (let i = 0; i < width * height; i++) {
      const pixelIndex = i * 4;
      const rgbIndex = i * 3;
      rgbData[rgbIndex] = data[pixelIndex] / 255.0;
      rgbData[rgbIndex + 1] = data[pixelIndex + 1] / 255.0;
      rgbData[rgbIndex + 2] = data[pixelIndex + 2] / 255.0;
    }

    const tensor = tf.tensor4d(rgbData, [1, height, width, 3]);
    return tensor;
  } catch (error) {
    console.error("Error preprocessing skin-tone image:", error);
    throw error;
  }
}

async function predict(imageBuffer) {
  try {
    await loadModel();
    const preprocessedImage = await preprocessImage(imageBuffer);

    let prediction;
    try {
      prediction = model.predict([preprocessedImage]);
    } catch (error1) {
      try {
        prediction = model.predict(preprocessedImage);
      } catch (error2) {
        try {
          const inputObject = { input_layer: preprocessedImage };
          prediction = model.predict(inputObject);
        } catch (error3) {
          const inputObject = { input_layer: preprocessedImage };
          prediction = model.execute(inputObject);
        }
      }
    }

    let result, resultArray;
    if (Array.isArray(prediction)) {
      result = await prediction[0].data();
      resultArray = Array.from(result);
      prediction.forEach((tensor) => tensor.dispose());
    } else {
      result = await prediction.data();
      resultArray = Array.from(result);
      prediction.dispose();
    }
    preprocessedImage.dispose();

    return resultArray;
  } catch (error) {
    console.error("Skin-tone prediction error:", error);
    throw error;
  }
}

function disposeModel() {
  if (model) {
    model.dispose();
    model = null;
    console.log("Skin-tone model disposed successfully.");
  }
}

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
