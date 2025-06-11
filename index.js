const express = require("express");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./src/routes/auth/authRoutes.js");
const faceShapeRoutes = require("./src/routes/predict/face-shape-routes.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static modeltfjs
app.use("/modeltfjs", express.static(path.join(__dirname, "./src/modeltfjs")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", faceShapeRoutes);

// Jalankan server Express biasa
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
