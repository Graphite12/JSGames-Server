const express = require("express");
// const passportConfig = require("./passport/index");
const passport = require("passport");
const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
const authRoute = require("./routes/users");
const mainRoute = require("./routes/main");
const mailerRoute = require("./routes/mailer");
const port = process.env.PORT || 3000;
const app = express();

const whitelist = [
  "http://localhost:3000",
  "http://*.jsgames.link",
  "http://jsgames.link",
];
const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
};

app.use(cookieParser());

app.use(logger("dev"));

app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(mainRoute);
app.use(authRoute);
app.use(mailerRoute);

let server;

if (fs.existsSync("./cert/key.pem") && fs.existsSync("./cert/cert.pem")) {
  const privateKey = fs.readFileSync(__dirname + "/cert/key.pem", "utf8");
  const certificate = fs.readFileSync(__dirname + "/cert/cert.pem", "utf8");
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(port, () => console.log("https server Running"));
} else {
  server = app.listen(port, () => {
    console.log(`http server Running`);
  });
}

module.exports = server;
