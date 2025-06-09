const express = require("express");
const {
  registerUser,
  getUserProfile,
} = require("../../controllers/auth/authController.js");
const { validateAccount } = require("../../utils/validate.js");
const router = express.Router();

router.post("/register", registerUser);

router.get("/profile", validateAccount, getUserProfile);

module.exports = router;
