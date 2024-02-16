const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, default: "User@example.com" },
    image: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png",
    },
    position: { type: String, default: "User" },
    password: String,
    points: Number,
    banned: { type: Boolean, default: false },
    pushToken : String,
    type: { type: String, default: "User" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
