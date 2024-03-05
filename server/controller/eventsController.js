const EventService = require("../service/eventsService.js");
const NotificationService = require("../service/notificationService.js");
const schedule = require("node-schedule");
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
      var Event = await EventService.findbyClient(req.params.id);
      if (Event) {
        return res.send(Event); // Return the response here
      } else {
        return res.status(404).send("Event not found");
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
      var Event = await EventService.getByStatus(req.body.status);
      res.send(Event);
    } catch (next) {
      res.status(401).json(next);
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
      req.io.emit("newEvent/Admin", Event);
      res.send({ msg: "inserted" });
      return;
    } catch (next) {
      console.log(next);
      res.status(401).json(next);
    }
  },

  chrone(date, minutesBeforeDate, callback) {
    const targetDateTime = new Date(date);
    const fifteenMinutesBefore = new Date(
      targetDateTime.getTime() - minutesBeforeDate * 60000
    );
    const job = schedule.scheduleJob(fifteenMinutesBefore, callback);
    console.log("Job scheduled to run at:", fifteenMinutesBefore);
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
      console.log(next);
      res.status(401).json(next);
    }
  },
  async getEventByUserIdAndStart(req, res, next) {
    try {
      const { userId, start } = req.body;
      const events = await EventService.getEventByUserIdAndStart(userId, start);
      res.send(events);
    } catch (error) {
      console.error("Error fetching events by userId:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  async accept(req, res, next) {
    try {
      var Event = await EventService.update(req.params.id, req.body);
      if (req.body.status === true) {
        const notificationData = {
          title: "تم قبول الحدث",
          text: "تم قبول الحدث من قبل العامل",
          redirection: req.params.id,
          client: req.body.client,
          time: new Date().toISOString(),
        };
        NotificationService.create(notificationData)
          .then((notification) => {
            req.io.emit("newNOTIF", notification);
          })
          .catch((error) => {
            console.error("Error saving notification:", error);
          });
      } else {
        const notificationData = {
          title: "تم رفض الحدث",
          text: "تم رفض الحدث من قبل العامل",
          redirection: req.params.id,
          client: req.body.client,
          time: new Date().toISOString(),
        };

        NotificationService.create(notificationData)
          .then((notification) => {
            req.io.emit("newNOTIF", notification);
          })
          .catch((error) => {
            console.error("Error saving notification:", error);
          });
      }

      this.chrone(Event.start, 15, () => {
        const notificationData = {
          title: "Event started",
          text: "The event has started",
          redirection: req.params.id,
          client: req.body.client,
          time: new Date().toISOString(),
        };
        // save the notification to the database
        NotificationService.create(notificationData)
          .then((notification) => {
            req.io.emit("newNOTIF", notification);
          })
          .catch((error) => {
            console.error("Error saving notification:", error);
          });
      });
      this.chrone(Event.start, 60, () => {
        const notificationData = {
          title: "Event finished",
          text: "The event has finished",
          redirection: req.params.id,
          client: req.body.client,
          time: new Date().toISOString(),
        };
        // save the notification to the database
        NotificationService.create(notificationData)
          .then((notification) => {
            req.io.emit("newNOTIF", notification);
          })
          .catch((error) => {
            console.error("Error saving notification:", error);
          });
      });
      this.chrone(Event.start, -30, () => {
        const notificationData = {
          title: "Event finished",
          text: "The event has finished",
          redirection: req.params.id,
          client: req.body.client,
          time: new Date().toISOString(),
        };
        // save the notification to the database
        NotificationService.create(notificationData)
          .then((notification) => {
            req.io.emit("newNOTIF", notification);
          })
          .catch((error) => {
            console.error("Error saving notification:", error);
          });
      });

      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
};
