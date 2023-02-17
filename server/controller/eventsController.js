const EventService = require("../service/eventsService.js");

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
 async create(req, res, next) {
    try {
      var exits = await EventService.checkIf(req.body.userId);
      if (exits[0]) {
        for (var i = 0; i < exits.length; i++) {
          if (
            req.body.start.valueOf() >= exits[0].start.valueOf() &&
            req.body.start.valueOf() <= exits[0].end.valueOf()
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
      } else {
        var Event = await EventService.create(req.body);
        res.send({ msg: "inserted" });
        return;
      }
    } catch (next) {
      console.log(next);
      res.status(401).json(next);
    }
  },
};
