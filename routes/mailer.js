const router = require("express").Router();
const { mailerModule } = require("../controller/userController/mailController");

router.post("/contact", mailerModule);

module.exports = router;
