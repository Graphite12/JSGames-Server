require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");

module.exports = {
  //새로 생성하게 될 토큰
  accessToken: (data) => {
    return sign(data, process.env.ACCESS_TOKEN, { expiresIn: "20s" });
  },
  // 특정 기간 마다 재생성할 토큰
  refreshToken: (data) => {
    return sign(data, process.env.REFRESH_TOKEN, { expiresIn: "30d" });
  },

  sendRefreshToken: (res, refToken) => {
    res.cookie("refreshToken", refToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  },
  // 토큰을 쿠키에 전달
  sendAccessToken: (res, at) => {
    res.json({ data: { at }, message: "OK" });
  },
  //접근 성공시
  resendAccessToken: (res, at, data) => {
    res.json({ data: { at, userInfo: data }, message: "OK" });
  },
  //접근 재전달시
  isAuthorized: (req) => {
    const auth = req.headers["authorization"];

    console.log(auth);

    if (!auth) {
      return null;
    }

    const token = authorization.split(" ")[1];
    try {
      return verify(token, process.env.ACCESS_TOKEN);
    } catch (e) {
      console.log(e, "json");
      return null;
    }
  },
  checkRefreshToken: (refreshToken) => {
    // refreshToken 검증
    try {
      return verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (e) {
      console.log(e);
      return null;
    }
  },
};
