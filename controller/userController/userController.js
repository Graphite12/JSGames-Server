const bcrypt = require("bcrypt");
const { User } = require("../../models");
const { sign, verify } = require("jsonwebtoken");
const {
  registerValidator,
  loginValidator,
} = require("../../validation/authValidation");
const { generateToken } = require("../../config/JWTConfig");
const { token } = require("morgan");
require("dotenv").config();

//token save
const tokenUsers = {};

exports.register = async (req, res) => {
  //   console.log(res);

  const { errors, isValid } = registerValidator(req.body);

  let { email, username, password } = req.body;

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    // const user = User.findOne({ where: { email: email, username: username } });
    // if (user) throw Error("User does not exist");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hashedPassword = await bcrypt.hash(password, salt);
    if (!hashedPassword)
      throw Error("Something went wrong hashing the password");

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };
    //
    User.create(newUser)
      .then((data) => {
        res.status(200).json({
          user: data,
        });
      })
      .catch((err) => {
        res.status(401).json({ Message: err.message });
      });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
  // await User.findOrCreate({
  //   where: { username: username, email: email },
  //   defaults: newUser,
  // })
  //   .then(([save, created]) => {
  //     if (!created) {
  //       return res.status(400).json({ message: "이미 사용중인 이메일입니다." });
  //     } else {
  //       console.log([save, created]);
  //       res.status(200).json({ status: "Success", new_user_id: save.id });
  //     }
  //   })
  //   .catch((err) => res.status(500).json({ message: err + "잘안됩니다." }));
};

exports.login = async (req, res) => {
  const { errors, isValid } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  try {
    User.findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User Not Found" });
        }

        const ValidPassword = bcrypt.compareSync(password, user.password);

        if (!ValidPassword) {
          return res.status(401).json({
            auth: false,
            accessToken: null,
            reason: "잘못된 비밀번호",
          });
        }

        const token = generateToken({ id: user._id });

        res
          .cookie("auth_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true,
          })
          .status(200)
          .json({ auth: true, accessToken: token });
      })
      .catch((err) => {
        res.status(500).json({ err });
      });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }

  // console.log(User.findOne({ where: { email: email } }));
  // User.findOne({ where: { email: email } }).then((data) => {
  //   const accessToken = generateToken(data.dataValues);
  //   const refreshedToken = refreshToken(data.dataValues);

  //   const ValidPassword = bcrypt.compare(password, data.dataValues.password);
  //   if (!ValidPassword) {
  //     return res.status(400).json({ message: "패스워드를 제대로 입력하세요" });
  //   }

  //   delete data.dataValues.password;
  //   console.log(data.dataValues);
  //   sendRefToken(res, refreshedToken);
  //   sendAccessToken(res, accessToken);

  // res
  //   .cookie("auth_token", accessToken,
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: true,
  //   })
  //   .status(200)
  //   .json({
  //     success: true,
  //     accessToken: accessToken,
  //     refereshToken: refreshedToken,
  // });
};
exports.profile = async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
  }
};

exports.logout = async (req, res) => {
  return res
    .clearCookie("auth_token")
    .status(200)
    .json({ message: "로그아웃 성공" });
};
