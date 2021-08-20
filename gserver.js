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
const port = process.env.PORT || 3000;
const app = express();

const whitelist = [
  "https://localhost:3000",
  "https://*.jsgames.link",
  "https://jsgames.link",
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
  methods: "GET,POST,PUT,DELETE,OPTION",
  optionsSuccessStatus: 200,
};

app.use(cookieParser());

app.use(logger("dev"));

app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", authRoute);
app.use(mainRoute);

app.listen(port, () => {
  console.log(`this is ${port}`);
});
