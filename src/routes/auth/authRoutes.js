const express = require("express");
const {
  registerUser,
  getUserProfileDetails,
} = require("../../controllers/auth/authController.js");
const { validateAccount } = require("../../utils/validate.js");
const router = express.Router();

router.post("/register", registerUser);

router.get("/profile", validateAccount, getUserProfileDetails);

module.exports = router;
