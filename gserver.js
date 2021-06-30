const express = require("express");
// const passportConfig = require("./passport/index");
// const passport = require("passport");
const https = require("https");

const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// const privateKey = fs.readFileSync(path.join(__dirname, "cert", "key.pem"));
// const certificate = fs.readFileSync(path.join(__dirname, "cert", "cert.pem"));

require("dotenv").config();
const authRoute = require("./routes/users");

const port = process.env.PORT || 8000;
const app = express();

const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: true,
};

const corsOption = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
};

const sslCert = {
  cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
};

app.use(logger("dev"));
app.use(cookieParser(cookieOption));
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(passport.initialize());
// passportConfig();

app.use("/auth", authRoute);
const gServer = https.createServer(sslCert, app);

gServer.listen(port, () => {
  console.log(`localhost:${port}`);
});
