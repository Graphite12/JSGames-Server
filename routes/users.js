const router = require("express").Router();

const userController = require("../controller/userController/userController");
const { authorization } = require("../config/JWTConfig");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/logout", authorization, userController.logout);
router.get("/profile", authorization, userController.profile);

module.exports = router;
