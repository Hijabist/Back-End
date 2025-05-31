require("dotenv").config();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require("mongodb");
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Server is running and MongoDb is connected");
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

main();
