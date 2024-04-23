const mongoose = require("mongoose");
const db = require("./connection.js");
const e = require("express");
mongoose.Promise = global.Promise;

const AdminSchema = new mongoose.Schema(
  {
    order: Number,
    username: String,
    email: { type: String, default: "admin@example.com", unique: true },
    phone: { type: String, default: "" },
    image: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-Vector-PNG-File.png",
    },
    position: { type: String, default: "Admin" },
    password: String,
    ResetCode: String,
    expiration: String,
    isSupper: { type: Boolean, default: true },
    type: { type: String, default: "Admin" },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
