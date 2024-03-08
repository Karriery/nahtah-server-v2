const router = require("express").Router();
const eventController = require("../controller/eventsController.js");

router.post("/create", eventController.create);
router.get("/", eventController.getEvent);
router.get("/id/:id", eventController.getEventById);
router.get("/client/:id", eventController.getEventByClient);
router.post("/today", eventController.getEventByUserIdAndStart);
router.post("/GetByRange", eventController.getEventsInRange);
router.put("/:id", eventController.updated);
router.post("/status/", eventController.getEventByStatus);
router.post("/review", eventController.getEventByUser);
router.delete("/:id", eventController.deleteByParams);
router.delete("/", eventController.deleteAllEvents);
router.put("/accept/:_id", eventController.accept);
router.put("/test/:client", eventController.test);

module.exports = router;
