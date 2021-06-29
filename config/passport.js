const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/user");
const model = require("../models/index");
const bcrypt = require("bcrypt");

require("dotenv").config();

const passportConfig = { usernameField: "email", passwordField: "password" };

const jwtStrategyOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

//중복 검사
const passportVerify = async (email, password, done) => {
  try {
    let user = await model.User.findOne({ where: { email: email } });

    if (!user) {
      return done(null, false, { reason: "존재하지 않는 사용자입니다." });
    }

    const comparePwd = await bcrypt.compare(password, user.password);

    if (comparePwd) {
      return done(null, user);
    }

    return done(null, false, { reason: "올바르지 않은 비밀번호입니다." });
  } catch (err) {
    return done(err);
  }
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await model.User.findOne({ where: { email: payload.email } });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

module.exports = () => {
  passport.use("local", new LocalStrategy(passportConfig, passportVerify)),
    passport.use("jwt", new StrategyJwt(jwtStrategyOption, jwtVerify));
};
