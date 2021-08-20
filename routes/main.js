const router = require("express").Router();
const { authorization } = require("../config/JWTConfig");

router.get("/", function (res, req) {
  console.log("Hello world");
});

module.exports = router;
