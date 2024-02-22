const EventService = require("../service/eventsService.js");
const NotificationService = require("../service/notificationService.js");
const schedule = require("node-schedule");
const { initializeApp } = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYjPRt6wBdGo9mbdf-MlGM6LqfG5Pz6Wo",
  authDomain: "myproject-ee9bd.firebaseapp.com",
  databaseURL: "https://myproject-ee9bd.firebaseio.com",
  projectId: "myproject-ee9bd",
  storageBucket: "myproject-ee9bd.appspot.com",
  messagingSenderId: "66258228658",
  appId: "1:66258228658:web:bf8e2339e25f5c238f80ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
        let modifiedEvents = events.map((event) => {
          if (!event.feedback && !event.rate) {
            return {
              feedback: "Event hasn't been rated",
              rate: "Event hasn't been rated",
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

      console.log(req.body);
      var Event = await EventService.create(req.body);
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

  sendNotification(title, text, eventId, client) {
    try {
      // new notification object
      const notificationData = {
        title: title,
        text: text,
        redirection: eventId,
        client: client, // hné make sure bech t3adi el User object
        time: new Date().toISOString(),
      };
      // save the notification to the database
      NotificationService.create(notificationData)
        .then((notification) => {
          console.log("Notification saved successfully:", notification);
          // ba3d successful save, success response (3maltha fil eventRouter)
        })
        .catch((error) => {
          console.error("Error saving notification:", error);
        });
    } catch (error) {
      console.error("Error creating and saving notification:", error);
    }
  },

  

  async accept(req, res, next) {
    try {
      var Event = await EventService.update(req.params.id, req.body);
      this.chrone(
        req.body.start,
        15,
        this.sendNotification('close event', 'the event is about to start after 15 mins', Event._id, req.body.client)
      );
      this.chrone(
        req.body.start,
        60,
        this.sendNotification('close event', 'the event is about to start after one hour', Event._id, req.body.client)
      );
      this.chrone(
        req.body.start,
        -30,
        this.sendNotification('ready to feedback', 'you can now give your feedback for your barber', Event._id, req.body.client)
      );

      res.send({ msg: "updated" });
    } catch (next) {
      res.status(401).json(next);
    }
  },
};
