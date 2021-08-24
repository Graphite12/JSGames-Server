const router = require("express").Router();

const {
  login,
  register,
  logout,
  profile,
} = require("../controller/userController/userController");
const { authorization } = require("../config/JWTConfig");

router.post("/login", login);
router.post("/register", register);
router.get("/logout", authorization, logout);
router.get("/profile", authorization, profile);

module.exports = router;
