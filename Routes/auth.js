const express = require("express");
const router = express.Router();
const passport = require("passport");
const register = require("../controller/User/Register");
const login = require("../controller/User/Login");

router.post(
  "/register",
  passport.authenticate("jwt", { session: false }),
  register
);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
// router.post("/register", register);
// router.post("/register", register);

module.exports = router;
