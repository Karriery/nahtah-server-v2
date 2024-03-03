var Store = require("../model/Store.js");

class StoreService {
  async create(data) {
    return Store.create(data);
  }
  async getAll() {
    return Store.find();
  }
  async getById(id) {
    return Store.findById(id);
  }

  async update(id, data) {
    return Store.findByIdAndUpdate;
  }
  async delete(id) {
    return Store.findByIdAndDelete(id);
  }
}
module.exports = new StoreService();
