const { auth } = require("../../../firebase.js");
const userModel = require("../../models/auth/userModel.js");

async function registerUser(req, res) {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName) {
    return res.status(404).json({
      error: "true",
      message: "Email, password, and display name are required.",
    });
  }
  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });

    await userModel.createUser({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(201).json({
      error: "false",
      message: "User registered successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    let message = error.message;
    if (error.code === "auth/email-already-exists") {
      message = "Email already exists. Please use a different email address.";
    }
    return res.status(500).json({
      error: "true",
      message,
    });
  }
}

async function getUserProfileDetails(req, res) {
  const uid = req.user.uid;
  try {
    const user = await userModel.getUserByUid(uid);
    const faceShape = await userModel.getFaceShapeByUid(uid);
    const skinTone = await userModel.getSkinToneByUid(uid);

    if (!user) {
      return res.status(404).json({
        error: "true",
        message: "User not found.",
      });
    }
    return res.status(200).json({
      error: "false",
      user,
      faceShape,
      skinTone,
    });
  } catch (error) {
    return res.status(500).json({
      error: "true",
      message: "An error occurred while fetching the user profile.",
    });
  }
}

module.exports = { registerUser, getUserProfileDetails };
