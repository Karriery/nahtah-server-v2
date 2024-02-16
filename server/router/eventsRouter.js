const router = require("express").Router();
const eventController = require("../controller/eventsController.js");
const { verifyAccessToken } = require("../jwt_helpers.js");

router.post("/create", eventController.create);
router.get("/", eventController.getEvent);
router.get("/id/:id", eventController.getEventById);
router.get("/client/:id", eventController.getEventByClient);
router.put("/:id", eventController.updated);
router.delete("/:id", eventController.deleteByParams);

module.exports = router;
