const { user } = require("../../models");
const {
  checkRefreshToken,
  generateToken,
  resendAccessToken,
} = require("../token");

module.exports = (req, res) => {
  const refreshToken = req.cookies.refreshsToken;
  if (!refreshToken) {
    return res.json({ message: "refresh token not provided" });
  }

  const refreshTokenData = checkRefreshToken(refreshToken);
  if (!refreshTokenData) {
    return res.json({ message: "invalid refresh token" });
  }

  const { id } = refreshTokenData;

  user
    .findOne({
      where: { id: id },
    })
    .then((result) => {
      if (!result) {
        return res.json({ message: "refresh token has been tempered" });
      }

      delete result.dataValues.password;
      const newAccessToken = generateToken(result.dataValues);
      resendAccessToken(res, newAccessToken, result.dataValues);
    })
    .catch((err) => {
      console.log(err);
    });
};
