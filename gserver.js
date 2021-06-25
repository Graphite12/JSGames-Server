const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.get("/", (req, res, next) => {
  res.send("Hello!!! SSL Server");
});

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem"), "utf-8"),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem"), "utf-8"),
  },
  app
);

sslServer.listen(port, () => console.log(`Secure server port ${port}`));
