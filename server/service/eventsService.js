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
  async getByStatus(status) {
    try {
      const events = await Event.find({ status: status }).exec();
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
    try {
      const updatedEnd = new Date(endRange);
      updatedEnd.setDate(updatedEnd.getDate() + 1); // Increment end date by 1 to include events on the end date
      const filteredEvents = await Event.find({
        start: { $gte: startRange, $lt: updatedEnd }, // Use $lt instead of $lte to exclude events on updatedEnd date
      }).exec();

      const startRangTimeArray = startRangTime.split(":");
      const endRangTimeArray = endRangTime.split(":");

      const startDateTime = new Date(startRange);
      startDateTime.setHours(parseInt(startRangTimeArray[0], 10));
      startDateTime.setMinutes(parseInt(startRangTimeArray[1], 10));

      const endDateTime = new Date(startRange);
      endDateTime.setHours(parseInt(endRangTimeArray[0], 10));
      endDateTime.setMinutes(parseInt(endRangTimeArray[1], 10));

      const filteredEventsByTime = filteredEvents.filter((event) => {
        const eventDate = new Date(event.start);
        const eventTime = eventDate.getHours() * 60 + eventDate.getMinutes();
        return (
          eventTime >=
            startDateTime.getHours() * 60 + startDateTime.getMinutes() &&
          eventTime <= endDateTime.getHours() * 60 + endDateTime.getMinutes()
        );
      });

      const sortByDate = (a, b) => {
        return new Date(a.start) - new Date(b.start); // Use a.start instead of b.start to sort in ascending order
      };

      const sortedEvents = filteredEventsByTime.sort(sortByDate);

      return sortedEvents;
    } catch (error) {
      throw error;
    }
  }

  deleteAllEvents() {
    return Event.deleteMany({});
  }
})();
