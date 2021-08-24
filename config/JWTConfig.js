const { sign, verify } = require("jsonwebtoken");

require("dotenv").config();

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.JWT_SECRET, { expiresIn: "1d" });
  },

  generateRefreshToken: (data) => {
    return sign(data, process.env.REF_JWT_SECRET, { expiresIn: "24d" });
  },

  sendRefreshToken: (res, refTkn) => {
    res
      .cookie("ref_token", refTkn, {
        httpOnly: true,
      })
      .json({ message: "리프레시 토큰 발급 완료" });
  },

  sendAccessToken: (res, accTkn) => {
    // res.json({
    //   token: accTkn,
    //   message: "로그인 성공",
    // });
    res
      .cookie("auth_token", accTkn, {
        httpOnly: true,
      })
      .json({
        maessage: "토큰 발급 완료",
      });
  },

  resendAccessToken: (res, token, data) => {
    res.cookie("auth_token", token, {
      httpOnly: true,
    });

    res.json({
      maessage: "success",
      userInfo: data,
    });
  },

  authorization: (req, res, next) => {
    let token = req.cookies.auth_token;
    let key = process.env.JWT_SECRET;

    try {
      verify(token, key);

      return next();
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        return res.status(403).json({
          status: 403,
          message: "토큰이 만료되었습니다.",
        });
      }
    }
    res.status(401).json({
      status: 401,
      message: "유효하지 않은 토큰입니다.",
    });
    // res.json({ message: decoded });
  },

  checkRefToken: (refTkn) => {
    try {
      return verify(refTkn, process.env.REF_JWT_SECRET);
    } catch (e) {
      return null;
    }
  },
};
