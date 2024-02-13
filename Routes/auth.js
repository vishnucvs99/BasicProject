const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




router.post("/login",async (req, res) => {
  try {
    const { userName, password } = req.body;
    console.log(userName, password)
    const user = await User.findOne({ userName });
    console.log(user._id)
    if (!user) {
      return res.status(401).json({ error: "Username authentication failed" });
    }
   // const passwordMatch = await bcrypt.compare(password, user.password);
    if (!password) {
      return res.status(401).json({ error: "Password Authentication failed" });
    }

    if(user.password === password){
      console.log("passord is correct")
    }
    const token = jwt.sign({ user: user }, "vishnu123", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
