const express = require("express");

const {addNotification } = require("../controllers/NotificationControllers");
const { protect } = require("../middleware/authUser");
const router = express.Router();

router.post ('/add',protect,addNotification);

module.exports = router;
