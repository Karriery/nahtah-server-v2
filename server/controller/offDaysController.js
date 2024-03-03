const offDaysService = require("../service/offDaysService.js");

module.exports = {
  async create(req, res) {
    try {
      const offDays = await offDaysService.create(req.body);
      res.status(201).send(offDays);
    } catch (error) {
      res.status;
    }
  },
  async getAll(req, res) {
    try {
      const offDays = await offDaysService.getAll();
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getById(req, res) {
    try {
      const offDays = await offDaysService.getById(req.params.id);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async getByuserIdAndDate(req, res) {
    try {
      const { userId, date } = req.body;
      const offDays = await offDaysService.getByUserIdAndDate(userId, date);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async update(req, res) {
    try {
      const offDays = await offDaysService.update(req.params.id, req.body);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async delete(req, res) {
    try {
      const offDays = await offDaysService.delete(req.params.id);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteAll(req, res) {
    try {
      const offDays = await offDaysService.DeleteAll();
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
