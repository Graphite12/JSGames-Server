const express = require("express");
const router = express.Router();

const signup = require("../controller/User/signup");
const signin = require("../controller/User/signin");
const signout = require("../controller/User/signout");
const userInfo = require("../controller/User/userinfo");
const refershTokenreq = require("../controller/User/reftokenReq");

router.post("/signin", signin);
router.post("/signout", signout);
router.post("/register", signup);
// router.get("/info", userInfo);
router.get("/refreshtokenrequest", refershTokenreq);

module.exports = router;
