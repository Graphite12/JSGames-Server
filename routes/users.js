const router = require("express").Router();

const {
  signin,
  signup,
  logout,
  profile,
} = require("../controller/userController/userController");
const { authorization } = require("../config/JWTConfig");

router.post("/auth/login", signin);
router.post("/auth/register", signup);
router.get("/auth/logout", authorization, logout);
router.get("/auth/profile", authorization, profile);

module.exports = router;
