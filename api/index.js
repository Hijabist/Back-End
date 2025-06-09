const express = require("express");
const serverless = require("serverless-http");
const path = require("path");

const authRoutes = require("../src/routes/auth/authRoutes.js");
const faceShapeRoutes = require("../src/routes/predict/face-shape-routes.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static modeltfjs (misal: modeltfjs ada di src/modeltfjs)
app.use("/modeltfjs", express.static(path.join(__dirname, "../src/modeltfjs")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", faceShapeRoutes);

// Export sebagai handler
module.exports = serverless(app);
