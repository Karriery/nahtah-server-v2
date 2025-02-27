var Event = require("../model/events.js");
const StoreService = require("./storeService");
module.exports = new (class EventService {
  async create(data) {
    const createdEvent = await Event.create(data);
    return await Event.populate(createdEvent, { path: "client" });
  }
  get() {
    return Event.find().sort({ start: "desc" }).populate("client");
  }
  find(status) {
    return Event.find({ status: status }).populate("client");
  }
  getById(_id) {
    return Event.findOne({ _id });
  }
  countDocuments(status) {
    return Event.countDocuments({ status: status });
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
  // async getEventsTodayAndTomorrow() {
  //   const stores = await StoreService.getAll();
  //   const timeRanges = stores.map((store) => {
  //     const timeOpen = new Date(store.timeOpen);
  //     const timeClose = new Date(store.timeClose);
  //     const timeRanges = [];
  //     let currentTime = new Date(timeOpen);
  //     while (currentTime < timeClose) {
  //       const hour = currentTime.getUTCHours().toString().padStart(2, "0");
  //       const minute = currentTime.getUTCMinutes().toString().padStart(2, "0");
  //       timeRanges.push(`${hour}:${minute}`);
  //       currentTime.setUTCMinutes(currentTime.getUTCMinutes() + 30);
  //     }
  //     return timeRanges;
  //   });
  //   const flattenedTimeRanges = timeRanges.flat();
  //   const beforeMidnight = [];
  //   const afterMidnight = [];
  //   let isAfterMidnight = false;
  //   flattenedTimeRanges.forEach((option) => {
  //     if (isAfterMidnight || option === "00:00") {
  //       afterMidnight.push(option);
  //       isAfterMidnight = true;
  //     } else {
  //       beforeMidnight.push(option);
  //     }
  //   });
  //   const firstBeforeMidnight = beforeMidnight[0];
  //   const lastAfterMidnight = afterMidnight[afterMidnight.length - 1];

  //   const today = new Date();
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(tomorrow.getDate() + 1);

  //   const todayString = today.toISOString().split("T")[0];
  //   const tomorrowString = tomorrow.toISOString().split("T")[0];

  //   try {
  //     const TheEvents = await Event.find({
  //       $or: [
  //         { start: { $regex: `^${todayString}` } },
  //         { start: { $regex: `^${tomorrowString}` } },
  //       ],
  //       status: true,
  //     }).populate("client");
  //     if (TheEvents && TheEvents.length > 0) {
  //       const filterTheEvents = TheEvents.filter((event) => {
  //         const currentDate = new Date();
  //         const startTimeToday = new Date(
  //           currentDate.setHours(
  //             firstBeforeMidnight.split(":")[0],
  //             firstBeforeMidnight.split(":")[1],
  //             0,
  //             0
  //           )
  //         );
  //         const endTimeTomorrow = new Date(currentDate);
  //         endTimeTomorrow.setUTCHours(
  //           parseInt(lastAfterMidnight.split(":")[0]),
  //           parseInt(lastAfterMidnight.split(":")[1])
  //         );
  //         endTimeTomorrow.setDate(endTimeTomorrow.getDate() + 1);
  //         const eventStart = new Date(event.start);
  //         return eventStart >= startTimeToday && eventStart < endTimeTomorrow;
  //       });

  //       return filterTheEvents;
  //     } else {
  //       return { message: "No events found" };
  //     }
  //   } catch (error) {
  //     return { message: `Error retrieving events: ${error.message}` };
  //   }
  // }

  async getEventsTodayAndTomorrow() {
    const stores = await StoreService.getAll();
    const timeRanges = stores.map((store) => {
      const timeOpen = new Date(store.timeOpen);
      const timeClose = new Date(store.timeClose);
      const timeRanges = [];
      let currentTime = new Date(timeOpen);
      while (currentTime < timeClose) {
        const hour = currentTime.getUTCHours().toString().padStart(2, "0");
        const minute = currentTime.getUTCMinutes().toString().padStart(2, "0");
        timeRanges.push(`${hour}:${minute}`);
        currentTime.setUTCMinutes(currentTime.getUTCMinutes() + 30);
      }
      return timeRanges;
    });
    const flattenedTimeRanges = timeRanges.flat();
    const beforeMidnight = [];
    const afterMidnight = [];
    let isAfterMidnight = false;
    flattenedTimeRanges.forEach((option, index) => {
      if (isAfterMidnight || (option === "00:00" && index !== 0)) {
        afterMidnight.push(option);
        isAfterMidnight = true;
      } else {
        beforeMidnight.push(option);
      }
    });
    const firstBeforeMidnight = beforeMidnight[0];
    const lastAfterMidnight = afterMidnight[afterMidnight.length - 1]
      ? afterMidnight[afterMidnight.length - 1]
      : null;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayString = today.toISOString().split("T")[0];
    const tomorrowString =
      lastAfterMidnight === null
        ? todayString
        : tomorrow.toISOString().split("T")[0];
    try {
      const TheEvents = await Event.find({
        status: true,
        $or: [
          { start: { $regex: `^${todayString}` } },
          { start: { $regex: `^${tomorrowString}` } },
        ],
      }).populate("client");

      if (TheEvents.length > 0) {
        const eventstillLastBeforeMidnight = TheEvents.filter((event) => {
          const [eventDate, eventTime] = event.start.split(" ");
          return (
            eventDate === todayString &&
            eventTime >= firstBeforeMidnight &&
            eventTime <= beforeMidnight[beforeMidnight.length - 1]
          );
        });

        const eventstillLastAfterMidnight = TheEvents.filter((event) => {
          const [eventDate, eventTime] = event.start.split(" ");
          return eventDate === tomorrowString && eventTime <= lastAfterMidnight;
        });

        return [
          ...eventstillLastBeforeMidnight,
          ...eventstillLastAfterMidnight,
        ];
      } else {
        return { message: "No events found" };
      }
    } catch (error) {
      return { message: `Error retrieving events: ${error.message}` };
    }
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
    return Event.find({
      start: { $regex: regex },
      status: { $ne: false },
    }).populate("client");
  }

  async getEventByUserIdAndStart(userId, start) {
    const startDate = new Date(start);
    const nextDate = new Date(startDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const startDateString = startDate.toISOString().slice(0, 10);
    const nextDateString = nextDate.toISOString().slice(0, 10);
    const dateRegex = new RegExp(`^${startDateString}`);
    const dateRegexEnd = new RegExp(`^${nextDateString}`);
    const events = await Event.find({
      $or: [
        { start: { $regex: dateRegex } },
        { start: { $regex: dateRegexEnd } },
      ],
      userId: userId,
    });

    return events.map((event) => {
      const eventDate = event.start.split(" ")[0];
      const isTomorrow = eventDate === nextDateString;
      return { ...event.toObject(), isTomorrow };
    });
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
