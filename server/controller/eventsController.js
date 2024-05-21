const EventService = require("../service/eventsService.js");
const NotificationService = require("../service/notificationService.js");
const schedule = require("node-schedule");
const firebaseConfig = require("../service/FirBaseService.js");
const { Expo } = require("expo-server-sdk");
const expo = new Expo();

// const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDYjPRt6wBdGo9mbdf-MlGM6LqfG5Pz6Wo",
//   authDomain: "myproject-ee9bd.firebaseapp.com",
//   databaseURL: "https://myproject-ee9bd.firebaseio.com",
//   projectId: "myproject-ee9bd",
//   storageBucket: "myproject-ee9bd.appspot.com",
//   messagingSenderId: "66258228658",
//   appId: "1:66258228658:web:bf8e2339e25f5c238f80ab",
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
module.exports = {
  async getEvent(req, res, next) {
    try {
      var Event = await EventService.get();
      res.send(Event);
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getEventById(req, res, next) {
    try {
      var Event = await EventService.getById(req.params.id);
      res.send(Event);
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getEventByClient(req, res, next) {
    try {
      var events = await EventService.findbyClient(req.params.id);
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 7;
      if (events && events.length > 0) {
        const sortedEvents = events.sort((a, b) => {
          // Custom sorting logic
          const getStatusValue = (event) => {
            if (event.status === null) {
              return 1;
            } else if (
              event.status &&
              new Date() < new Date(event.end).getTime() + 60 * 60 * 1000
            ) {
              return 2;
            } else if (
              event.status &&
              new Date() > new Date(event.end).getTime() + 60 * 60 * 1000
            ) {
              return 3;
            } else {
              return 4;
            }
          };

          // Sort by status first
          const statusComparison = getStatusValue(a) - getStatusValue(b);
          if (statusComparison !== 0) {
            return statusComparison;
          }

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

        const skip = (page - 1) * limit;
        const paginatedEvents = sortedEvents.slice(skip, skip + limit);
        const totalEvents = sortedEvents.length;
        const totalPages = Math.ceil(totalEvents / limit);

        res.send({
          sortedEvents: paginatedEvents,
          totalPages,
          currentPage: page,
        });
      } else {
        return res.send({ message: "No events found" });
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      return res.status(500).send("Internal Server Error");
    }
  },
  async deleteByParams(req, res, next) {
    try {
      var Event = await EventService.delete(req.params.id);
      res.send({ msg: "deleted" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  deleteAllEvents(req, res, next) {
    EventService.deleteAllEvents()
      .then((result) => {
        res.send({ message: "All events deleted successfully" });
      })
      .catch((error) => {
        console.error("Error deleting events:", error);
        res.status(500).send("Internal Server Error");
      });
  },

  async updated(req, res, next) {
    try {
      var Event = await EventService.update(req.params.id, req.body);
      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getEventByStatus(req, res, next) {
    try {
      const events = await EventService.getByStatus(req.body.status);

      // Get the current date
      const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Filter out events that have already occurred
      const upcomingEvents = events.filter(
        (event) => event.start.split(" ")[0] >= currentDate
      );
      // Send the filtered list of upcoming events
      if (upcomingEvents) {
        res.send(upcomingEvents);
      } else {
        res.status(404).json({ message: "No upcoming events found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getEventByUser(req, res, next) {
    EventService.getEventByUser(req.body.userId)
      .then((events) => {
        let modifiedEvents = events
          .filter((event) => event.status === true)
          .map((event) => {
            if (!event.feedback && !event.rate) {
              return {
                feedback: "Event hasn't been rated",
                rate: "-",
              };
            }
            return event;
          });
        res.send(modifiedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
      });
  },
  async create(req, res, next) {
    try {
      var sameDayEvents = await EventService.getbyToday(req.body.start);
      for (var i = 0; i < sameDayEvents.length; i++) {
        if (
          req.body.start.valueOf() >= sameDayEvents[i].start.valueOf() &&
          req.body.start.valueOf() < sameDayEvents[i].end.valueOf() &&
          req.body.userId === sameDayEvents[i].userId
        ) {
          res.send({
            alert: "event with this worker and time already exist",
          });
          return;
        }
      }

      var Event = await EventService.create(req.body);
      req.io.emit("newEvent", Event);
      res.send({ msg: "inserted" });
      return;
    } catch (next) {
      res.status(401).json(next);
    }
  },

  async createWithUser(req, res, next) {
    try {
      var sameDayEvents = await EventService.getbyToday(req.body.start);
      for (var i = 0; i < sameDayEvents.length; i++) {
        if (
          req.body.start.valueOf() >= sameDayEvents[i].start.valueOf() &&
          req.body.start.valueOf() < sameDayEvents[i].end.valueOf() &&
          req.body.userId === sameDayEvents[i].userId
        ) {
          res.send({
            alert: "event with this worker and time already exist",
          });
          return;
        }
      }

      var Event = await EventService.create(req.body);
      res.send({ msg: "inserted" });
      return;
    } catch (next) {
      res.status(401).json(next);
    }
  },
  async getEventByUserIdAndStart(req, res, next) {
    try {
      const { userId, start } = req.body;
      const events = await EventService.getEventByUserIdAndStart(userId, start);

      const startTimes = events.map((event) => {
        return event.start.split(" ")[1];
      });

      res.send(start ? startTimes : []);
    } catch (error) {
      console.error("Error fetching events by userId:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  async getEventsInRange(req, res, next) {
    try {
      const { startRange, endRange, startRangTime, endRangTime } = req.body;
      const events = await EventService.getEventsInRange(
        startRange,
        endRange,
        startRangTime,
        endRangTime
      );
      res.send(events);
    } catch (error) {
      console.error("Error fetching events within range:", error);
      res.status(500).send("Internal Server Error");
    }
  },
  async updateStatus(req, res, next) {
    try {
      const { _id, status, client } = req.body;
      var Event = await EventService.updateStatus(_id, status, client);
      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
  getEventTodays(req, res, next) {
    EventService.getEventTodays()
      .then((events) => {
        res.send(events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal Server Error");
      });
  },

  async test(req, res, next) {
    await SendNotification(
      req.params.client,
      "Event starting",
      "The event is starting soon",
      "default"
    );
    res.send({ msg: "updated" });
  },

  async accept(req, res, next) {
    try {
      const { status, client } = req.body;
      const { _id } = req.params;
      var Event = await EventService.updateStatus(_id, status);
      chrone(Event.start, 15, async () => {
        await SendNotification(
          client,
          "تذكير",
          `لديك موعد حلاقة على الساعة ${new Date(
            Event.start
          ).getHours()}:${new Date(Event.start).getMinutes()}`,
          "الحدث سيبدأ قريبًا",
          "default"
        );
      });

      chrone(Event.start, 60, async () => {
        await SendNotification(
          client,
          "تذكير",
          `لديك موعد حلاقة على الساعة ${new Date(
            Event.start
          ).getHours()}:${new Date(Event.start).getMinutes()}`,
          "default"
        );
      });
      chrone(Event.start, -30, async () => {
        await SendNotification(
          client,
          "انتهاء الحدث",
          "انتهى الحدث",
          "default"
        );
      });
      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
};

function chrone(date, minutesBeforeDate, callback) {
  const targetDateTime = new Date(date);
  const fifteenMinutesBefore = new Date(
    targetDateTime.getTime() - minutesBeforeDate * 60000
  );
  const job = schedule.scheduleJob(fifteenMinutesBefore, callback);
}

var SendNotification = async (client, title, body, channelId) => {
  const tokens = await firebaseConfig.GetTokens(client);

  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title: title || "Event",
    body: body || "Event",
    channelId: channelId || "default",
  }));
  await NotificationService.create({
    title: title,
    text: body,
    client: client,
    time: new Date().toISOString(),
  });

  try {
    const chunks = expo.chunkPushNotifications(messages);

    for (let chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    }
    return "Notification sent";
  } catch (error) {
    console.error("Error sending push notification:", error);
    return "Error sending push notification";
  }
};
