require("dotenv").config();
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const { User } = require("../models");
const bcrypt = require("bcrypt");

const localStrOption = {
  usernameField: "email",
  passwordField: "password",
};

const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const LocalStrVerify = async (email, pwd, done) => {
  try {
    const user = await User.findOne({ where: { email: email } });
    console.log(user);
    if (!user) {
      return done(null, false, { message: "존재하지 않는 사용자 입니다." });
    }

    const compareResult = await bcrypt.compare(pwd, user.password);

    if (!compareResult) {
      return done(null, false, { reason: "올바르지 않은 비밀번호 입니다." });
    }
  } catch (error) {
    console.error(error);
    return done(error);
  }
  return done(null, user);
};

const JwtVerify = async (payload, done) => {
  try {
    let users = await user.findOne({ where: { email: payload.email } });
    if (!users) return done(null, false);
  } catch (err) {
    return done(err);
  }
  return done(null, users);
};

module.exports = () => {
  passport.use("login", new localStrategy(localStrOption, LocalStrVerify));
  passport.use("jwt", new JWTStrategy(jwtConfig, JwtVerify));
};
