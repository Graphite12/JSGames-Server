const router = require("express").Router();
const passport = require("passport");
const { User } = require("../models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
//Google Route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.PP_GOOGLE_ID,
      clientSecret: process.env.PP_GOOGLE_SECRET,
      callbackURL: `https://localhost:5000/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile.email);
      console.log(accessToken);
      console.log(refreshToken);
      User.findOne({ where: { email: profile.email } }, function (err, user) {
        if (user) {
          return db(null, user);
        }

        let newUser = User.create({
          id: user.id,
          username: user.displayName,
          email: user.email,
          provider: "google",
        });

        db(null, newUser);
      });
    }
  )
);

// // router.get(

// //   "/auth/google/redirect",
// //   passport.authenticate("google", {
// //     session: false,
// //     failureRedirect: "https://localhost:3000/auth/login",
// //   }),
// //   (req, res) => {
// //     res.redirect(req.user);
// //   }
// // );

//Microsoft Route
router.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", {
    session: false,
    scope: ["profile"],
    session: false,
  })
);
router.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);
// router.get(
//   "/auth/microsoft/redirect",
//   passport.authenticate({
//     session: false,
//     failureRedirect: "https://localhost:3000/auth/login",
//   }),
//   (req, res) => {
//     res.redirect(req.user);
//   }
// );

module.exports = router;
