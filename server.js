const express = require("express");
const { Storage } = require("@google-cloud/storage");
const tf = require("@tensorflow/tfjs-node");

const app = express();
const storage = new Storage();

const bucketName = "asclepius-ml-models";
const modelFileName = "model.json"; // Ganti dengan nama file model Anda
const modelFilePath = `https://storage.googleapis.com/${bucketName}/${modelFileName}`;

let model;

async function loadModel() {
  try {
    model = await tf.loadGraphModel(modelFilePath);
    console.log("Model loaded successfully");
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
}

app.get("/load-model", async (req, res) => {
  try {
    await loadModel();
    res.status(200).send("Model loaded successfully");
  } catch (error) {
    res.status(500).send("Failed to load model");
  }
});

app.post("/predict", express.json(), async (req, res) => {
  if (!model) {
    await loadModel();
  }

  try {
    const { imageData } = req.body;
    const inputTensor = tf.node.decodeImage(Buffer.from(imageData, "base64"));
    const prediction = model.predict(inputTensor.expandDims(0));
    const result = prediction.dataSync()[0];
    const classification = result > 0.5 ? "Cancer" : "Non-cancer";

    res.status(200).json({
      status: "success",
      message: "Prediction made successfully",
      result: classification,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to make prediction",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
