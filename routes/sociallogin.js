const router = require("express").Router();
const passport = require("passport");
const { User } = require("../models");
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
