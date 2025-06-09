const express = require("express");
const multer = require("multer");
const { validateAccount } = require("../../utils/validate.js");
const {
  predictSkinTone,
} = require("../../controllers/tensor/skin-tone-controllers.js");
const { exp } = require("@tensorflow/tfjs");

const router = express.Router();
const upload = multer({ dest: "/tmp" }); // Temp folder for uploaded images


router.post(
  "/skin-tone",
  validateAccount,
  upload.single("image"),
  predictSkinTone
);

module.exports = router;
