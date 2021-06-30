const router = require("express").Router();
const bcrypt = require("bcrypt");
const userController = require("../controller/userController/userController");

router.post("/login", userController.login);
router.post("/register", userController.register);

module.exports = router;
