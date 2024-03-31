const mongoose = require("mongoose");

const db = mongoose.connect(
  "mongodb://localhost/nahtaouta",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = db;
