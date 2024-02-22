const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const NotificationSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    redirection: String,
    time: String,
    client: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    vue: { type: Boolean, default: false },
    type: { type: String, default: "Notification" },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
