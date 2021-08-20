const { sign, verify } = require("jsonwebtoken");
const {
  refreshAccessToken,
} = require("../controller/userController/userController");
require("dotenv").config();

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.JWT_SECRET, { expiresIn: "15s" });
  },

  generateRefreshToken: (data) => {
    return sign(data, process.env.REF_JWT_SECRET, { expiresIn: "30d" });
  },

  authorization: (req, res, next) => {
    let token = req.cookies.auth_token;
    let key = process.env.JWT_SECRET;

    try {
      jwt.verify(token, key);
      return next();
    } catch (e) {
      if (e.name === "TokenExpiredError") {
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
  },
};
