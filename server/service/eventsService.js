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

  updateStatus(_id, status) {
    return Event.findOneAndUpdate({ _id }, { status });
  }

  findbyClient(client) {
    return Event.find({ client }).populate("client");
  }
  getbyToday(today) {
    const regex = new RegExp(today.slice(0, 10), "i");
    return Event.find({ start: { $regex: regex } });
  }
  getEventByUserIdAndStart(userId, start) {
    const dateRegex = new RegExp(`^${start}`);
    return Event.find({ userId: userId, start: { $regex: dateRegex } });
  }
  async getEventsInRange(startRange, endRange) {
    try {
      const Ennnnd = new Date(endRange);
      Ennnnd.setDate(Ennnnd.getDate() + 1);
      const updatedEnd = Ennnnd.toISOString().split("T")[0];
      const filteredEvents = await Event.find({
        start: { $gte: startRange, $lte: updatedEnd },
      }).exec();

      const SortByDate = (a, b) => {
        return a.start - b.start;
      };
      filteredEvents.sort(SortByDate);

      return filteredEvents;
    } catch (error) {
      throw error;
    }
  }

  deleteAllEvents() {
    return Event.deleteMany({});
  }
})();
