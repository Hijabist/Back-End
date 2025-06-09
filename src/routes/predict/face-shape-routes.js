const express = require("express");
const multer = require("multer");
const {
  predictFaceShape,
} = require("../../controllers/tensor/face-shape-controllers");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/face-shape", upload.single("image"), predictFaceShape);

module.exports = router;
