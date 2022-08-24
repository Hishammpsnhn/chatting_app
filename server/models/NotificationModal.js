const mongoose = require("mongoose");

const notificationModel = mongoose.Schema(
  {
    user: { type: String, required: true },
    notifications: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
  },
  {
    timestamps: true,
  }
);

const Notifications = mongoose.model("Notification", notificationModel);
module.exports = Notifications;
