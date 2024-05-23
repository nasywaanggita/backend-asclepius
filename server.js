const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3000;

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1000000 },
});

app.post("/predict", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }

  const predictionResult = "Cancer";
  const suggestion = "Segera periksa ke dokter!";

  res.json({
    status: "success",
    message: "Model is predicted successfully",
    data: {
      id: uuidv4(),
      result: predictionResult,
      suggestion: suggestion,
      createdAt: new Date().toISOString(),
    },
  });
});

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      status: "fail",
      message: "Payload content length greater than maximum allowed: 1000000",
    });
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
