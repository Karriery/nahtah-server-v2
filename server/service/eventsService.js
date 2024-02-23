var Event = require("../model/events.js");

module.exports = new (class EventService {
  create(data) {
    return Event.create(data);
  }
  get() {
    return Event.find().sort({ start: "desc" }).populate("client");
  }
  getById(_id) {
    return Event.findOne({ _id });
  }
  getByStatus(status) {
    return Event.find({
      status: status,
    });
  }
  getEventByUser(userId) {
    return Event.find({ userId: userId });
  }

  delete(_id) {
    return Event.findOneAndDelete({ _id });
  }
  update(_id, data) {
    return Event.findOneAndUpdate({ _id }, data);
  }
  checkIf(userId) {
    return Event.find({ userId });
  }
  findbyClient(client) {
    return Event.find({ client }).populate("client");
  }
  getbyToday(today) {
    const regex = new RegExp(today.slice(0, 10), "i");
    return Event.find({ start: { $regex: regex } });
  }
  deleteAllEvents() {
    return Event.deleteMany({});
  }
})();
