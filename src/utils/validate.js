const { auth } = require("../../firebase.js");

async function validateAccount(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "true",
      message: "Unauthorized: No token provided.",
    });
  }
  const token = header.split(" ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      error: "true",
      message: "Unauthorized: Invalid token.",
    });
  }
}

module.exports = { validateAccount };
