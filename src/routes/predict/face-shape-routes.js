const express = require("express");
const multer = require("multer");
const { validateAccount } = require("../../utils/validate.js");
const {
  predictFaceShape,
  getMyFacePredictions,
} = require("../../controllers/tensor/face-shape-controllers");

const {
  predictSkinTone,
  getUserSkinTonePredictions,
} = require("../../controllers/tensor/skin-tone-controllers.js");

const router = express.Router();
const upload = multer({ dest: "/tmp" });

router.post(
  "/face-shape",
  validateAccount,
  upload.single("image"),
  predictFaceShape
);

router.get("/face-shape/me", validateAccount, getMyFacePredictions);

router.post(
  "/skin-tone",
  validateAccount,
  upload.single("image"),
  predictSkinTone
);

router.get("/skin-tone/me", validateAccount, getUserSkinTonePredictions);

module.exports = router;
