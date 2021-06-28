const { user } = require("../../models");
const bcrypt = require("bcrypt");

//해싱 해줄 값
const salt = 10;

module.exports = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send("회원 정보를 입력해 주세요.");
  }

  //패스워드를 DB에 저장하기 전 해싱
  const hash = await bcrypt.hash(password, salt);

  user
    .findOrCreate({
      where: { email: email },
      default: {
        password: hash,
      },
    })
    .then((result, creted) => {
      if (!creted) {
        res.send("이미 존재하는 이메일입니다.");
      } else {
        res.status(201).json({
          data: result.dataValues,
          message: "회원가입 완료",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "server error" + err });
    });
};
