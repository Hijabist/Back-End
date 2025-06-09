const express = require("express");
const multer = require("multer");
const { validateAccount } = require("../../utils/validate.js");
const {
  predictFaceShape,
} = require("../../controllers/tensor/face-shape-controllers");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/face-shape",
  validateAccount,
  upload.single("image"),
  predictFaceShape
);

module.exports = router;
