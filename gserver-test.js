require("dotenv").config();
const express = require("express");
const https = require("https");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3333;

//passport
const passport = require("passport");
const passportJWT = require("passport-jwt");

//토큰 추출
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest;
const userRouter = require("./Routes/user");

const corsOption = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
};

app.use(logger("dev"));
app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/signin");

app.get("/", (req, res, next) => {
  res.json({ message: "Hello!!! SSL Server" });
});

app.use((err, req, res, next) => {
  console.log(`ERROR:${err}`);
});

const privateKey = fs.readFileSync(path.join(__dirname, "cert", "key.pem"));
const certificate = fs.readFileSync(path.join(__dirname, "cert", "cert.pem"));

const credentials = {
  key: privateKey,
  cert: certificate,
};

const gServer = https.createServer(credentials, app);

gServer.listen(port, () => console.log(`Secure server port ${port}`));

module.exports = gServer;
