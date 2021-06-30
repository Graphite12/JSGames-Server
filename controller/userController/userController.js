const bcrypt = require("bcrypt");
const { User } = require("../../models");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  let { email, username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    const user = await User.create({
      username: username,
      email: email,
      password: hash,
    });

    if (user) {
      return res.status(201).send("회원가입 성공!");
    }
  } catch (err) {
    return res.status(500).send("회원가입 실패!" + err);
  }
};

exports.login = async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send("User Not Found.");
    }
  } catch (err) {
    return res.status(500).send("Error -> " + err);
  }

  const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({
      auth: false,
      accessToken: null,
      reason: "Invalid Password!",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: 86400, // expires in 24 hours
    }
  );

  return res.status(200).send({
    auth: true,
    accessToken: token,
  });
};
