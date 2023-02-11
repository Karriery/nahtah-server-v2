var Event = require("../model/events.js");

module.exports = new (class EventService {
  create(data) {
    return Event.create(data);
  }
  get() {
    return Event.find().sort({ start: "desc" });
  }
  getById(_id) {
    return Event.findOne({ _id });
  }
  delete(_id) {
    return Event.findOneAndDelete({ _id });
  }
  update(_id, data) {
    return Event.findOneAndUpdate({ _id }, data);
  }
})();
