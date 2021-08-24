const router = require("express").Router();
const {
  accessTokens,
  refreshTokens,
} = require("../controller/userController/tokenController");

router.get("/", (req, res) => {
  res.send("JSGaems에 오신것을 환영합니다.");
});
router.get("/refreshTokenrequest", refreshTokens);

module.exports = router;
