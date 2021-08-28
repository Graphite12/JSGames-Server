const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-google-oauth20").Strategy;

const jwt = require("jsonwebtoken");
const { User } = require("../../models");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PP_GOOGLE_ID,
      clientSecret: process.env.PP_GOOGLE_SECRET,
      callbackURL: `http://localhost:5000/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ id: profile.id }, function (err, user) {
        return db(null, user);
      });
    }
  )
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.PP_MICROSOFT_ID,
      clientSecret: process.env.PP_MICROSOFT_ID,
      callbackURL: `https://localhost:5000/auth/microsoft/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
