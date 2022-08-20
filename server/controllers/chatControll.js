const chat = require("../models/chatModels");
const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { findById, findByIdAndUpdate } = require("../models/chatModels");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log("suer",userId, req.user._id);
  if (!userId) {
    console.log("userId param not sent with request");
    return res.status(400);
  }

  var isChat = await chat
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");
  console.log(isChat);
  isChat = await Users.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await chat.create(chatData);
      const FullChat = await chat
        .findOne({ _id: createdChat._id })
        .populate("users", "-password");
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    chat
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await Users.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  console.log("createGroup",req.body)
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: "Please fill all the fields" });
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    res.status(400).send({ message: "Please add two or more users" });
  }
  users.push(req.users);
  try {
    const groupChat = await chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
    });
    const fullGroupChat = await chat
      .findOne({ _id: groupChat.id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await chat
    .findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await chat
    .findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const removeGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const remove = await chat
    .findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!remove) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(remove);
  }
});


module.exports = {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeGroup,
};
