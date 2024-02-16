var Notification = require("../model/notification.js");

module.exports = new (class NotificationService {
  create(data) {
    return Notification.create(data);
  }
  get() {
    return Notification.find().sort({ time: "desc" });
  }
  getById(_id) {
    return Notification.findOne({ _id });
  }
  delete(_id) {
    return Notification.findOneAndDelete({ _id });
  }
  update(_id, data) {
    return Notification.findOneAndUpdate({ _id }, data);
  }
  checkIf(userId) {
    return Notification.find({ userId });
  }
  findbyClient(client) {
    return Notification.find({ client });
  }
  getbyToday(today) {
    const regex = new RegExp(today.slice(0, 10), "i"); // i for case insensitive
    return Notification.find({ start: { $regex: regex } });
  }
})();
