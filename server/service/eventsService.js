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
    const Events = Event.find({
      status: status,
    });
    const sortedEvents = Events.sort((a, b) => {
      // If status is the same, sort by event date
      const dateA = new Date(a.start.replace(" ", "T"));
      const dateB = new Date(b.start.replace(" ", "T"));
      const dateComparison = dateB - dateA;
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If event dates are the same, sort by start time
      const timeA = dateA.getHours() * 60 + dateA.getMinutes();
      const timeB = dateB.getHours() * 60 + dateB.getMinutes();
      return timeB - timeA;
    });
    return sortedEvents;
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

      const sortByDate = (a, b) => {
        const dateA = new Date(a.start);
        const dateB = new Date(b.start);
        return dateA - dateB;
      };

      filteredEvents.sort(sortByDate);

      return filteredEvents;
    } catch (error) {
      throw error;
    }
  }

  deleteAllEvents() {
    return Event.deleteMany({});
  }
})();
