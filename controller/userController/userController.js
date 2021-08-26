const bcrypt = require("bcrypt");
const { User } = require("../../models");
const { sign, verify } = require("jsonwebtoken");
const {
  registerValidator,
  loginValidator,
} = require("../../validation/authValidation");
const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../../config/JWTConfig");

require("dotenv").config();

module.exports = {
  register: async (req, res) => {
    const { password, email, username } = req.body;

    const hash = await bcrypt.hashSync(password, 10);
    const newUser = {
      username: username,
      email: email,
      password: hash,
    };
    try {
      await User.create(newUser).then((data) => {
        res.json({ data: data });
      });
    } catch (e) {
      console.log(e);
    }
  },

  login: async (req, res) => {
    const { password, email } = req.body;

    const origin = await User.findOne({ where: { email } });

    if (!origin) {
      return res.status(404).json({
        message: "유저를 찾을 수 없습니다.",
      });
    }

    if (!(await bcrypt.compareSync(password, origin.password))) {
      return res.status(400).json({
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    // delete data.dataValues.password;
    const accTokens = generateAccessToken({ _id: origin.id });
    const refTokens = generateRefreshToken({ _id: origin.id });
    sendAccessToken(res, accTokens);
    sendRefreshToken(res, refTokens);
  },

  logout: async (req, res) => {
    res
      .clearCookie("auth_token")
      .status(200)
      .json({
        message: "로그아웃 성공",
      })
      .redirect("/");
  },

  profile: async (req, res) => {
    const accessTokenData = req.cookies.auth_token;

    const verifys = verify(accessTokenData, process.env.JWT_SECRET);
    if (!verifys) {
      return res.json({ data: null, message: "토큰이 만료되었습니다." });
    }

    const users = await User.findOne({ where: { id: verifys._id } });

    res.json({
      user: {
        userName: users.username,
        email: users.email,
        addAccount: users.createdAt,
      },
    });
  },
};
