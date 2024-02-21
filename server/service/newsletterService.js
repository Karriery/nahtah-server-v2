const Newsletter = require('../model/newsletterModel');

class NewsletterService {
  async create(data) {
    return Newsletter.create(data);
  }
  async getAll() {
    return Newsletter.find();
  }
  async getById(id) {
    return Newsletter.findById(id);
  }
  async update(id, data) {
    return Newsletter.findByIdAndUpdate(id, data, { new: true });
  }
  async delete(id) {
    return Newsletter.findByIdAndDelete(id);
  }
  async getByAdminId(adminId) {
    return Newsletter.find({ admin: adminId });
  }
}

module.exports = new NewsletterService();
