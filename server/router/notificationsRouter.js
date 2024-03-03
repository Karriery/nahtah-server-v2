const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notificationsController");

router.get("/:client", notificationController.getNotificationsByClient);
router.put("/:id", notificationController.updateNotification);
router.post("/", notificationController.createNotification);
router.delete("/", notificationController.deleteAllNotifications);

module.exports = router;
