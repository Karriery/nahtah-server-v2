const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const StoreSchema = new mongoose.Schema(
  {
    timeOpen: String,
    timeClose: String,
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
