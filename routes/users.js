const router = require("express").Router();

const userController = require("../controller/userController/userController");
const { authorization } = require("../config/JWTConfig");

router.post("/auth/login", userController.login);
router.post("/auth/register", userController.register);
router.get("/auth/logout", authorization, userController.logout);
router.get("/auth/profile", authorization, userController.profile);

module.exports = router;
