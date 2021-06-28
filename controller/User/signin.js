const { user } = require("../../models");
const {
  generateToken,
  refreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../token");

const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  const userInfo = await user.findOne({
    where: { email: email },
  });

  if (!userInfo) {
    return res.status(401).json({ message: "로그인 실패" });
  }

  const validPwd = await bcrypt.compare(password, userInfo.dataValues.password);

  if (!validPwd) {
    return res.status(400).json({ message: "회원 정보가 올바르지 않습니다." });
  } else {
    delete userInfo.dataValues.password;
    //result에서 사용자 비밀번호 삭제
    const accessToken = generateToken(userInfo.dataValues);
    const refreshsToken = refreshToken(userInfo.dataValues);

    // 생성한 토큰 전달
    sendRefreshToken(res, refreshsToken);
    sendAccessToken(res, accessToken);
  }
};
