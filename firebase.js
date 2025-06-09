const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
// Lokasi file JSON service account
const keyPath = path.join(__dirname, "./myfirebase.json");

// Inisialisasi hanya jika belum ada app
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.project_id + ".appspot.com",
    // Bisa juga hardcode: storageBucket: "hijabist-web.appspot.com"
  });

  console.log("✅ Firebase initialized via bulogkufile.json");
}

// Export service
const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

module.exports = {
  admin,
  db,
  auth,
  bucket,
};
