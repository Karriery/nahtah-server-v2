var Store = require("../model/Store.js");

class StoreService {
  async findOne() {
    return Store.findOne({}, { timeOpen: 1, timeClose: 1 });
  }

  async create(data) {
    const { timeOpen, timeClose, userId } = data;
    if (!timeOpen || !timeClose) {
      let openTime = new Date(`1970-01-01T00:00:00Z`);
      let closeTime = new Date(`1970-01-01T23:59:59Z`);
      data.timeOpen = openTime;
      data.timeClose = closeTime;
      const storeData = {
        timeOpen: openTime,
        timeClose: closeTime,
        userId: userId,
      };
      return Store.create(storeData);
    }
    let openTime = new Date(`1970-01-01T${timeOpen}:00Z`);
    let closeTime = new Date(`1970-01-01T${timeClose}:00Z`);

    if (closeTime <= openTime) {
      closeTime.setUTCDate(closeTime.getUTCDate() + 1);
    }

    // Save the original time strings
    data.timeOpen = timeOpen;
    data.timeClose = timeClose;

    const storeData = {
      timeOpen: openTime,
      timeClose: closeTime,
      userId: userId,
    };

    return Store.create(storeData);
  }

  async getAll() {
    return Store.find();
  }

  async getById(id) {
    return Store.findById(id);
  }

  async update(id, data) {
    const { timeOpen, timeClose } = data;

    // Create date objects for the provided times
    let openTime = new Date(`1970-01-01T${timeOpen}:00Z`);
    let closeTime = new Date(`1970-01-01T${timeClose}:00Z`);

    // Adjust the closeTime if it is earlier than the openTime
    if (closeTime <= openTime) {
      closeTime.setUTCDate(closeTime.getUTCDate() + 1);
    }

    // Save the original time strings
    data.timeOpen = timeOpen;
    data.timeClose = timeClose;

    const storeData = {
      timeOpen: openTime,
      timeClose: closeTime,
    };

    return Store.findByIdAndUpdate(id, storeData, { new: true });
  }

  async delete(id) {
    return Store.findByIdAndDelete(id);
  }

  async DeleteAll() {
    return Store.deleteMany();
  }
}

module.exports = new StoreService();
