const router = require("express").Router();

router.get("/", (req, res) => {
  console.log("hello Worlds");
  res.json({ message: "new Server!" });
});

module.exports = router;
