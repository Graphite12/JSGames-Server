const express = require("express");
// const passportConfig = require("./passport/index");
const passport = require("passport");
const https = require("https");

const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
const authRoute = require("./routes/users");
const mainRoute = require("./routes/index");
const port = process.env.PORT || 3000;
const app = express();

const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: true,
};

const corsOption = {
  origin: ["https://localhost:3000"],
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(authRoute);
app.use(mainRoute);

const gServer = https.createServer(sslCert, app);

gServer.listen(port, () => {
  console.log(`localhost:${port}`);
});
