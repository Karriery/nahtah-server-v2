const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const offDaysSchema = new mongoose.Schema(
  {
    userId: string,
    date: string,
  },
  {
    timestamps: true,
  }
);

const offDays = mongoose.model("offDays", offDaysSchema);

module.exports = offDays;
