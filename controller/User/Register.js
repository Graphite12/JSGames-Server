const User = require("../../models/user");
const model = require("../../models/index");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const { username, email, password } = req.body;

  const user = await model.User.findOne({ where: { email } });

  if (password.length < 8) {
    throw "패스워드를 8자 이상 입력하세요";
  }
  if (user) {
    return res.status(403).json({ message: "사용중인 이메일입니다." });
  } else {
    const newUser = { username, email, password };
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hashSync(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        User.create(newUser).then((user) => {
          console.log(user);
          res.json({ user }).catch((err) => res.status(500).json({ err }));
        });
      });
    });
  }
};
