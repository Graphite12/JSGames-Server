const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3333;

const corsOption = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
};

app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.json({ message: "Hello!!! SSL Server" });
});

app.use((err, req, res, next) => {
  console.log(`ERROR:${err}`);
});

const privateKey = fs.readFileSync(
  path.join(__dirname, "cert", "key.pem"),
  "utf-8"
);

const certificate = fs.readFileSync(
  path.join(__dirname, "cert", "cert.pem"),
  "utf-8"
);

const credentials = { key: privateKey, cert: certificate };

const gServer = https.createServer(credentials, app);

gServer.listen(port, () => console.log(`Secure server port ${port}`));

module.exports = gServer;
