var Event = require("../model/events.js");

module.exports = new (class EventService {
  async create(data) {
    const createdEvent = await Event.create(data);
    return await Event.populate(createdEvent, { path: "client" });
  }
  get() {
    return Event.find().sort({ start: "desc" }).populate("client");
  }
  getById(_id) {
    return Event.findOne({ _id });
  }
  async getByStatus(status) {
    try {
      const events = await Event.find({ status: status })
        .populate("client")
        .exec();
      const sortedEvents = events.sort((a, b) => {
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
    } catch (error) {
      console.error("Error in getByStatus:", error);
      throw error;
    }
  }

  getEventByUser(userId) {
    return Event.find({ userId: userId });
  }
  getEventTodays() {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    return Event.find({
      start: { $regex: `^${todayString}` },
      status: true,
    }).populate("client");
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
  async getEventsInRange(startRange, endRange, startRangTime, endRangTime) {
    const AllEvents = await Event.find().populate("client");
    const eventsInRange = await AllEvents.filter((event) => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      const rangeStartDate = new Date(startRange);
      const rangeEndDate = new Date(endRange);
      rangeEndDate.setDate(rangeEndDate.getDate() + 1);
      return eventStartDate >= rangeStartDate && eventEndDate <= rangeEndDate;
    });

    const eventsInRangeTime = await eventsInRange.filter((event) => {
      const eventStartTime = event.start.split(" ")[1];
      const eventEndTime = event.end.split(" ")[1];
      const rangeStartTime = startRangTime;
      const rangeEndTime = endRangTime;
      return eventStartTime >= rangeStartTime && eventEndTime <= rangeEndTime;
    });
    const sortedEvents = eventsInRangeTime.sort((a, b) => {
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

  deleteAllEvents() {
    return Event.deleteMany({});
  }
})();
