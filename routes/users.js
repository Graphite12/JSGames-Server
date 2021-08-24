const router = require("express").Router();

const {
  login,
  register,
  logout,
  profile,
} = require("../controller/userController/userController");
const { authorization } = require("../config/JWTConfig");

router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/logout", authorization, logout);
router.get("/auth/profile", authorization, profile);

module.exports = router;
