const NotificationService = require("../service/notificationService");
module.exports = {
  async createNotification(req, res) {
    try {
      debugger; // Set a breakpoint here
      const newNotification = await NotificationService.create(req.body);
      req.io.emit("newNotification", newNotification, (err) => {
        if (err) {
          console.error("Error sending notification:", err);
        }
      });
      res.status(201).json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getNotificationsByClient(req, res) {
    try {
      const client = req.params.client;
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;

      // Retrieve all notifications for the client
      const allNotifications = await NotificationService.findbyClient(
        client
      ).exec();

      // Sort notifications by 'vue' property (false first)
      const sortedNotifications = allNotifications.sort((a, b) => {
        if (a.vue === b.vue) {
          return 0;
        } else if (a.vue === false) {
          return -1;
        } else {
          return 1;
        }
      });

      // Paginate the sorted notifications
      const skip = (page - 1) * limit;
      const paginatedNotifications = sortedNotifications.slice(
        skip,
        skip + limit
      );

      // Count total notifications for the client
      const totalNotifications = sortedNotifications.length;

      // Calculate total pages based on limit
      const totalPages = Math.ceil(totalNotifications / limit);

      let uncheckedNotifications = 0;

      // Count unchecked notifications across all pages
      for (const notification of sortedNotifications) {
        if (!notification.vue) {
          uncheckedNotifications++;
        }
      }

      res.status(200).json({
        sortedEvents: paginatedNotifications,
        totalPages,
        currentPage: page,
        uncheckedNotifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async deleteAllNotifications(req, res) {
    try {
      await NotificationService.deleteAll();
      res.status(200).json({ message: "All notifications deleted" });
    } catch (error) {
      console.error("Error deleting notifications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateNotification(req, res) {
    try {
      const notificationId = req.params.id;
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
