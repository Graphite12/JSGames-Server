const router = require("express").Router();

router.get("/", function (req, res) {
  res.send("JSGaems에 오신것을 환영합니다.");
});

module.exports = router;
