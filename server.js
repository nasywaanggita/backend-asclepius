const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

const upload = multer({ dest: "uploads/" });

app.post("/predict", upload.single("image"), (req, res) => {
  res.json({
    message: "Image received",
    filename: req.file.filename,
    prediction: "Cancer/Non-cancer",
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
