const OffDaysService = require("../service/offDaysService.js");

module.exports = {
  async create(req, res) {
    try {
      const { userId, date } = req.body;
      const offDays = await OffDaysService.getByUserIdAndDate(userId, date);
      if (offDays.length) {
        res.send({ alert: "off day already exist" });
        return;
      } else {
        const offDay = await OffDaysService.create({ userId, date });
        res.status(201).json(offDay);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAll(req, res) {
    try {
      const offDays = await OffDaysService.getAll();
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getById(req, res) {
    try {
      const offDays = await OffDaysService.getById(req.params.id);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getByUserId(req, res) {
    try {
      const offDays = await OffDaysService.getByUserId(req.params.userId);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send;
    }
  },
  async getByuserIdAndDate(req, res) {
    try {
      const { userId, date } = req.body;
      const offDays = await OffDaysService.getByUserIdAndDate(userId, date);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async getByDate(req, res) {
    try {
      const offDays = await OffDaysService.getByDate(req.body.date);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async update(req, res) {
    try {
      const offDays = await OffDaysService.update(req.params.id, req.body);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async delete(req, res) {
    try {
      const offDays = await OffDaysService.delete(req.params.id);
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteAll(req, res) {
    try {
      const offDays = await OffDaysService.DeleteAll();
      res.status(200).send(offDays);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
