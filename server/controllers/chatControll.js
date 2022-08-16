const chat = require("../models/chatModels");
const Users = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId, req.user._id);
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

const fetchChat =asyncHandler(async (req, res) => {
    try {
        chat.find({users:{ $elemMatch:{$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async(result)=>{
            result = await Users.populate(result,{
                path:"latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(result);
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
module.exports = { accessChat,fetchChat };
