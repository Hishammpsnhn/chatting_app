const express = require("express");

const { registerUser,loginUser, allUsers } = require("../controllers/userControl");
const { protect } = require("../middleware/authUser");
const router = express.Router();

router.route("/").post(registerUser).get(protect,allUsers);

router.post('/login',loginUser)

module.exports = router;
