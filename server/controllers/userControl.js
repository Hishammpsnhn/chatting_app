const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the feilds");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) throw new Error("user already existed");
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("failed to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter all the feilds");
  }
  const existingUser = await userModel.findOne({ email });
  if (!existingUser) throw new Error("user does not exist");
  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) throw new Error("Incorrect Password");
  if (isPasswordCorrect) {
    res.status(201).json({
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      pic: existingUser.pic,
      token: generateToken(existingUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Login failed");
  }
});

const allUsers = asyncHandler(async (req, res) => {
 console.log("all user callled")
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "1" } },
          { email: { $regex: req.query.search, $options: "1" } },
        ],
      }
    : {};
  console.log(keyword);
  const user = await userModel.find(keyword).find({_id:{$ne: req.query._id}})
      res.send(user)
});

module.exports = { registerUser, loginUser, allUsers };
