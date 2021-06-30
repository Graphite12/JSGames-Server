const router = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../models/user");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
 
    try {
        const newUser = await user.create({
            username: username,
            email: email,
            password: hash
        })
    }

});
