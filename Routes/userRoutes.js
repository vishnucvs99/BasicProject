const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../Models/User");

const verifyToken = require("../Middleware/authMiddleware");

const {
  getUser,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUser,
} = require("../Controller/usercontroller");

router.get("/user", verifyToken, getUser);

router.get("/user/:emailid", verifyToken, getUserByEmail);

router.post("/user", verifyToken, addUser);

router.put("/user/:userId", verifyToken, updateUser);

router.delete("/user/:userId", verifyToken, deleteUser);

module.exports = router;
