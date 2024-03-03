var offDays = require("../model/offDays.js");

class offDaysService {
  async create(data) {
    return offDays.create(data);
  }
  async getAll() {
    return offDays.find();
  }
  async getById(id) {
    return offDays.findById(id);
  }
  async getByUserId(userId) {
    return offDays.find({ userId: userId });
  }
  async getByUserIdAndDate(userId, date) {
    return offDays.find({ userId: userId, date: date });
  }
  async update(id, data) {
    return offDays.findByIdAndUpdate;
  }
  async delete(id) {
    return offDays.findByIdAndDelete(id);
  }
  async DeleteAll() {
    return offDays.deleteMany();
  }
}
module.exports = new offDaysService();
