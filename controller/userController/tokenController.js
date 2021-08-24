const {
  authorization,
  checkRefToken,
  generateAccessToken,
  resendAccessToken,
  generateRefreshToken,
} = require("../../config/JWTConfig");
const { User } = require("../../models");
const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  //   //AccessToken
  //   accessTokens: (req, res) => {
  //     const accessTokenData = req.cookies.auth_token;

  //     const verifysUser = verify(accessTokenData, process.env.JWT_SECRET);
  //     if (!verifysUser) {
  //       return res.json({ data: null, message: "토큰이 만료되었습니다." });
  //     }

  //     console.log(verifysUser);

  //     User.findOne({ where: { id: verifysUser._id } })
  //       .then((data) => {
  //         if (!data) {
  //           return res.json({
  //             data: null,
  //             message: `access token has been tempered`,
  //           });
  //         }

  //         delete data.dataValues.password;
  //         return res.json({ data: { userInfo: data.dataValues }, message: "ok" });
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });
  //   },

  //RefreshToken
  refreshTokens: (req, res) => {
    const refreshToken = req.cookies.ref_Token;

    if (!refreshToken) {
      return res.json({ data: null, message: "토큰이 만료되었습니다." });
    }

    refreshTokenData = checkRefToken(refreshToken);
    if (!refreshTokenData) {
      return res.json({
        data: null,
        message: "재발급 토큰이 만료되었으니, 다시 로그인을 해주세요.",
      });
    }

    User.findOne({ where: { id: refreshTokenData._id } })
      .then((data) => {
        if (!data) {
          return res.json({
            data: null,
            message: `reftoken has been tempered`,
          });
        }

        delete data.dataValues.password;
        const newAccessToken = generateAccessToken(data.dataValues);
        resendAccessToken(res, newAccessToken, data.dataValues);
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
