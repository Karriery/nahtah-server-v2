const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const StoreSchema = new mongoose.Schema(
  {
    date: String,
    timeOpen: String,
    timeClose: String,
    userId: String,
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
