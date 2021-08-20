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
} = require("../../config/JWTConfig");
require("dotenv").config();

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const bcryptPwd = await bcrypt.hashSync(password, 12);

    const user = await User.create({ username, email, password: bcryptPwd });
    res.status(200).json({ data: user });
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const originUser = await User.findOne({ where: { email: email } });
    const validPwd = bcrypt.compareSync(password, originUser.password);

    if (!originUser) {
      return res.status(404).json({ message: "계정을 생성해 주세요." });
    }
    if (!validPwd) {
      return res.status(404).json({ message: "비밀번호가 잘못됬습니다." });
    }
    console.log(originUser);

    const accToken = generateAccessToken({ id: originUser._id });
    const refToken = generateRefreshToken({ id: originUser._id });

    res.cookie("auth_token", accToken).status(200).json({
      message: "로그인 성공!",
      accToken: accToken,
      refToken: refToken,
      data: originUser,
    });
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

exports.profile = async (req, res) => {
  if (req.cookies) {
    console.log(req.cookies.auth_token);
  }
  res.status(200).json({ message: "가입을 환영합니다!" });
};

exports.logout = (req, res) => {
  return res
    .clearCookie("auth_token")
    .redirect("/")
    .status(200)
    .json({ message: "로그아웃 성공" });
};
