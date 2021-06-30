const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/login", async (req, res) => {
  try {
    passport.authenticate("login", (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ message: info.reaseon });
      }

      req.login(user, { session: false }, (loginErr) => {
        if (loginErr) {
          return res.send(loginErr);
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env);
        res.json({ token });
      });
    })(req, res);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
