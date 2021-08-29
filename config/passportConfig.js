const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-google-oauth20").Strategy;
const LocalStragegy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = (passport) => {
  //소셜
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.PP_GOOGLE_ID,
        clientSecret: process.env.PP_GOOGLE_SECRET,
        callbackURL: `https://localhost:5000/auth/google/callback`,
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate(
          { where: { email: profile.email } },
          function (err, user) {
            return cb(null, user);
          }
        );
      }
    )
  );

  passport.use(
    "microsoft",
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

  /* ======================================================================
                로컬 JWT 인증
  */

  const passportRegisterVerify = async (id, pwd, done) => {
    try {
      const oldUser = await User.findOne({ where: { email: id } });
      if (oldUser) {
        done(null, false, { message: "이미 가입한 이메일 입니다." });
      } else {
        const hashed = await bcrypt.hashSync(pwd, 10);
        User.create({ id, hashed }).then((user) => {
          console.log("유저생성완료");
          return done(null, user);
        });
      }
    } catch (e) {
      done(e);
    }
  };

  // 로그인
  const passportloginVerify = async (id, pwd, done) => {
    try {
      const user = await User.findOne({ where: { email: id } });

      if (!user) {
        done(null, false, { message: `존재하지 않는 사용자입니다.` });
        return;
      }
      const compareResult = await bcrypt.compare(pwd, user.password);

      if (compareResult) {
        done(null, user);
        return;
      }

      done(null, false, { reason: "올바르지 않은 비밀번호 입니다." });
    } catch (e) {
      console.log(e);
      done(e);
    }
  };
  //JWT 검증
  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: process.env.JWT_SECRET,
  };

  const jwtVerify = async (payload, done) => {
    try {
      const thisUser = await User.findOne({ where: { email: payload.email } });
      if (thisUser) {
        console.log("유저를 찾았습니다.");
        done(null, thisUser);
      } else {
        console.log("유저를 찾을 수 없습니다.");
        done(null, false);
      }
    } catch (e) {
      done(e);
    }
  };

  //패스포트 사용

  let passportConfig = { usernameField: "email", passwordField: "password" };

  passport.use(
    "singin",
    new LocalStragegy(passportConfig, passportloginVerify)
  );
  passport.use(
    "register",
    new LocalStragegy(passportConfig, passportRegisterVerify)
  );
  passport.use("jwt", new JWTStrategy(opts, jwtVerify));
};
