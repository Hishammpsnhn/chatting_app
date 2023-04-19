const asyncHandler = require("express-async-handler");
const chat = require("../models/chatModels");
const Message = require("../models/messageModel");
const Users = require("../models/userModel");


const sendMessage = asyncHandler(async (req, res) => {
//  console.log("req.body")
//  console.log(req.body)
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("invalid data passed into request");
    return res.status(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
  
    message = await Users.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
  

    await chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    console.log(message);
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  //  console.log(req.params)
  try {
    const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender","name email pic")
    .populate("chat");
//    console.log(messages)
    res.json(messages)
} catch (error) {
    res.status(400);
    throw new Error(error);
  
}
});

module.exports = { sendMessage, allMessages };
