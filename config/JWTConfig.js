const jwt = require("jsonwebtoken");
const {
  refreshAccessToken,
} = require("../controller/userController/userController");
require("dotenv").config();

exports.generateToken = (target) => {
  return jwt.sign(target, process.env.JWT_SECRET, { expiresIn: 3600 });
};

// exports.refreshToken = (target) => {
//   return jwt.sign(target, process.env.REF_JWT_SECRET, { expiresIn: "15h" });
// };

exports.sendRefToken = (res, restkn) => {
  res.cookie("auth_token", restkn, {
    httpOnly: true,
    secure: true,
    sameSite: true,
  });
};

// exports.sendAccessToken = (res, accessToken) => {
//   res.json({ data: { accessToken }, message: "ok" });
// };

// exports.resendAccessToken = (res, accessToken, target) => {
//   res.json({ data: { accessToken, userInfo: target }, message: "ok" });
// };

exports.authorization = (req, res, next) => {
  let token = req.cookies.user_token;
  let key = process.env.JWT_SECRET;

  if (!token) {
    return res.status(403).json({
      auth: false,
      message: "인증이 만료됨",
    });
  }

  try {
    jwt.verify(token, key);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({
        status: 403,
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(401).json({
      status: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }

  // res.json({ message: decoded });
};
