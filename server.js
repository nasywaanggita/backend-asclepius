const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const port = 8080;

// Setup multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, // 1MB
});

// Endpoint for prediction
app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }

  // Simulate prediction
  const result = "Cancer"; // Replace with actual model prediction
  const suggestion = "Segera periksa ke dokter!";

  res.status(200).json({
    status: "success",
    message: "Model is predicted successfully",
    data: {
      id: uuidv4(),
      result,
      suggestion,
      createdAt: new Date().toISOString(),
    },
  });
});

// Handle payload too large error
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  } else {
    next(err);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
