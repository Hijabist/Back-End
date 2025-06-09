const express = require("express");
const path = require("path"); // Tambahkan ini!
const authRoutes = require("./src/routes/auth/authRoutes.js");
const faceShapeRoutes = require("./src/routes/predict/face-shape-routes.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tambahkan serve static modeltfjs DI SINI:
app.use("/modeltfjs", express.static(path.join(__dirname, "src/modeltfjs")));

// Setelah itu, routes API kamu
app.use("/api/auth", authRoutes);
app.use("/api/predict", faceShapeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
