const router = require("express").Router();
const eventController = require("../controller/eventsController.js");
const { verifyAccessToken } = require("../jwt_helpers.js");

router.post("/create", eventController.create);
router.get("/", eventController.getEvent);
router.get("/id/:id", eventController.getEventById);
router.get("/client/:id", eventController.getEventByClient);
router.put("/:id", eventController.updated);
router.post("/status/", eventController.getEventByStatus);
router.delete("/:id", eventController.deleteByParams);
router.post("/send-notification", async (req, res) => {
  try {
    const { title, text, eventId, client } = req.body;
    await eventController.sendNotification(title, text, eventId, client);
    res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
