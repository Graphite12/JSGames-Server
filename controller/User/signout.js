const { user } = require("../../models");
module.exports = async (req, res) => {
  await user
    .findOne({
      where: { userId: req.body.id },
    })
    .then((result) => {
      if (!result) {
        res.status(401).json({ message: "존재하지 않는 유저입니다." });
      }
      res.cookie("refreshToken", "").json({ message: "로그아웃 완료!" });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "Not Found" });
    });
};
