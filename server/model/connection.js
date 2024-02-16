const mongoose = require("mongoose");

const db = mongoose.connect(
  "mongodb+srv://halim:20028952Sami@cluster0.b1pz3.mongodb.net/nahtahtest?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
module.exports = db;
