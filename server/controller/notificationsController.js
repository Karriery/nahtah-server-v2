const NotificationService = require("../service/notificationService");
module.exports = {
  async createNotification(req, res) {
    try {
      const newNotification = await NotificationService.create(req.body);
      const clientId = req.body.client;
      req.io.join(clientId);
      req.io.to(clientId).emit("newNotification", newNotification);

      res.status(201).json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getNotificationsByClient(req, res) {
    try {
      const client = req.params.client;
      const notifications = await NotificationService.findbyClient(client);
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateNotification(req, res) {
    try {
      const notificationId = req.params.id;
      console.log(notificationId);
      const updatedNotification = await NotificationService.update(
        notificationId,
        req.body
      );
      res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
