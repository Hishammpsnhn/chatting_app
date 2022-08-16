const express = require('express');
const { accessChat,fetchChat } = require('../controllers/chatControll');
const {protect }= require('../middleware/authUser');
const router = express.Router();

 router.route("/").post (protect,accessChat);
 router.route("/").get (protect,fetchChat);
// router.route("/group").post (protect,createGroup)
// router.route("/rename").put (protect,renameGroup);
// router.route("/groupromove").put (protect,removeGroup);
// router.route("/groupadd").put (protect,addToGroup)

module.exports = router;