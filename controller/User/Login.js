const User = require("../../models/user");
const model = require("../../models/index");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  model.User.findAll({
    where: { email },
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).json("중복되는 아이디");
      }
      let originalPwd = user[0].dataValues.password;

      bcrypt
        .compare(password, originalPwd)
        .then((isMatch) => {
          if (isMatch) {
            const { id, username } = user[0].dataValues;
            const payload = { id, username };

            jwt.sign(
              payload,
              "secret",
              {
                expiresIn: 3600,
              },
              (err, token) => {
                res.json({ token: token });
              }
            );
          } else {
            return res.status(400).json("비밀번호가 적합하지 않습니다.");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).json("가입을 해주세요"));
};
