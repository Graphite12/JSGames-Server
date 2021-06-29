const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const passport = require("passport");
const https = require("https");

const app = express();

const passportConfig = require("./config/passport");
const auth = require("./Routes/auth");

const corsOption = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
};
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOption));
app.use(passport.initialize());
passportConfig();

app.use("/auth", auth);
app.use("/", (req, res) => res.send("Hello"));

const privateKey = fs.readFileSync(path.join(__dirname, "cert", "key.pem"));
const certificate = fs.readFileSync(path.join(__dirname, "cert", "cert.pem"));

const credentials = {
  key: privateKey,
  cert: certificate,
};

const gServer = https.createServer(credentials, app);
const port = process.env.PORT || 3333;

gServer.listen(port, () => console.log(`Secure server port ${port}`));
