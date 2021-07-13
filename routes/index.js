const router = require("express").Router();
const { authorization } = require("../config/JWTConfig");

router.get("/", function (res, req) {
  console.log("Hello world");
});
router.get("/profile", authorization, (req, res) => {
  console.log(req.user);
  res.json({ message: "hello", id: req.user.id });
});

module.exports = router;
