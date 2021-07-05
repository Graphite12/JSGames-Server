const bcrypt = require("bcrypt");
const { User } = require("../../models");
const jwt = require("jsonwebtoken");
const {
  registerValidator,
  loginValidator,
} = require("../../validation/authValidation");

require("dotenv").config();

exports.register = async (req, res) => {
  //   console.log(res);

  const { errors, isValid } = registerValidator(req.body);

  let { email, username, password } = req.body;

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // const emailExists = await User.findOne({ Where: { email: email } });
  // console.log(emailExists);
  // if (emailExists) {
  //   return res.status(400).json({ message: "이미 사용중인 이메일입니다." });
  // }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    username: username,
    email: email,
    password: hashedPassword,
  };

  await User.findOrCreate({
    where: { username: username, email: email },
    defaults: newUser,
  })
    .then(([save, created]) => {
      if (!created) {
        return res.status(400).json({ message: "이미 사용중인 이메일입니다." });
      } else {
        console.log([save, created]);
        res.status(200).json({ status: "Success", new_user_id: save.id });
      }
    })
    .catch((err) => res.status(500).json({ message: err + "잘안됩니다." }));

  //   User.findAll({ where: { email } }).then((user) => {
  //     if (user) {
  //       return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
  //     } else {
  //       let newUser = {
  //         username: username,
  //         email: email,
  //         password,
  //       };

  //       bcrypt.genSalt(10, (err, salt) => {
  //         bcrypt.hash(newUser.password, salt, (err, hash) => {
  //           if (err) throw err;
  //           newUser.password = hash;
  //           User.create(newUser)
  //             .then((user) => {
  //               res.json({ message: "가입이 완료되었습니다." });
  //             })
  //             .catch((err) => {
  //               res.status(500).json({ err });
  //             });
  //         });
  //       });
  //     }
  //   });
};

exports.login = async (req, res) => {
  const { errors, isValid } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });
  if (!user) return res.status(400).send("존재하지 않는 계정입니다.");

  const ValidPassword = await bcrypt.compare(password, user.password);
  if (!ValidPassword) {
    return res.status(400).send("패스워드를 제대로 입력하세요");
  }

  const token = await jwt.sign(
    {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 10,
    },
    process.env.JWT_SECRET
  );

  res
    .cookie("auth_token", token, { httpOnly: true, secure: true })
    .status(200)
    .json({ success: true, userName: user.username, email: email });
  //   const { email, password } = req.body;
  //   let user = User.findAll({ where: { email } });
  //   if (!user) {
  //     return res.status(401).json({ message: "계정이 존재하지 않습니다." });
  //   }
  //   const originPwd = user.dataValues.password;
  //   bcrypt.compare(password, originPwd).then((isMatch) => {
  //     if (isMatch) {
  //       const { id, username } = user.dataValues;
  //       const payload = { id, username };
  //       console.log(payload);
  //       jwt.sign(
  //         payload,
  //         process.env.JWT_SECRET,
  //         {
  //           expiresIn: "3d",
  //         },
  //         (err, token) => {
  //           res.json({ success: treu, token: "Bearer " + token });
  //         }
  //       );
  //     } else {
  //       return res.status(400).json({ message: "토큰이 유효하지 않습니다." });
  //     }
  //   });
  //   let user;
  //   try {
  //     user = await User.findOne({
  //       where: {
  //         email: req.body.email,
  //       },
  //     });
  //     if (!user) {
  //       return res.status(404).send("User Not Found.");
  //     }
  //   } catch (err) {
  //     return res.status(500).send("Error -> " + err);
  //   }
  //   const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  //   if (!passwordIsValid) {
  //     return res.status(401).send({
  //       auth: false,
  //       accessToken: null,
  //       reason: "Invalid Password!",
  //     });
  //   }
  //   const token = jwt.sign(
  //     {
  //       id: user.id,
  //     },
  //     process.env.JWT_SECRET,
  //     {
  //       expiresIn: 86400, // expires in 24 hours
  //     }
  //   );
  //   return res.status(200).send({
  //     auth: true,
  //     accessToken: token,
  //   });
};

exports.profile = async (req, res) => {};

exports.logout = async (req, res) => {
  const userid = req.body.id;

  const user = await User.findOne({ id: userid });

  if (!user) {
    res.status(401).json({ message: "존재하지 않는 유저입니다." });
  } else {
    res.cookie("auth_token", "").json({ message: "로그아웃 완료!" });
  }
};
