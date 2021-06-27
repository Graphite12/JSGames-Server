const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3333;

const corsOption = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
};

app.use(cors(corsOption));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  res.json({ message: "Hello!!! SSL Server" });
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem"), "utf-8"),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem"), "utf-8"),
  },
  app
);

sslServer.listen(port, () => console.log(`Secure server port ${port}`));
