const router = require("express").Router();
const { sendMail } = require("../controller/userController/mailController");

router.post("/contact", sendMail);

module.exports = router;
