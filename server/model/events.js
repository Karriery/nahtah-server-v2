const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const EventSchema = new mongoose.Schema(
  {
    title: String,
    start: String,
    end: String,
    userId: String,
    description: String,
    barberImg: String,
    client: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    status: { type: Boolean, default: null },
    reason: String,
    rate: { type: Number, default: undefined },
    feedback: { type: String, default: undefined },
    type: { type: String, default: "Event" },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
