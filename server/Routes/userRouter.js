const express = require("express");

const { registerUser,loginUser, allUsers,notification} = require("../controllers/userControl");
const { protect } = require("../middleware/authUser");
const router = express.Router();

router.route("/").post(registerUser).get(protect,allUsers);
router.post('/login',loginUser)
router.post ('/noti',notification)

module.exports = router;
