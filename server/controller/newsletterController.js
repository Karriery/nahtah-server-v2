const NewsletterService = require("../service/newsletterService");

module.exports = {
  async createNewsletter(req, res) {
    try {
      const newsletter = await NewsletterService.create(req.body);
      res.status(201).json(newsletter);
    } catch (error) {
      console.error("Error creating newsletter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getAllNewsletters(req, res) {
    try {
      let { page, limit } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 9;

      const allNewsletters = await NewsletterService.getAll();
      const skip = (page - 1) * limit;
      const paginatedNewsletters = allNewsletters.slice(skip, skip + limit);
      const totalNewsletters = allNewsletters.length;
      const totalPages = Math.ceil(totalNewsletters / limit);

      res.status(200).json({
        newsletters: paginatedNewsletters,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching newsletters:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getNewsletterById(req, res) {
    try {
      const newsletterId = req.params.id;
      const newsletter = await NewsletterService.getById(newsletterId);
      if (!newsletter) {
        return res.status(404).json({ error: "Newsletter not found" });
      }
      res.status(200).json(newsletter);
    } catch (error) {
      console.error("Error fetching newsletter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateNewsletter(req, res) {
    try {
      const newsletterId = req.params.id;
      const updatedNewsletter = await NewsletterService.update(
        newsletterId,
        req.body
      );
      res.status(200).json(updatedNewsletter);
    } catch (error) {
      console.error("Error updating newsletter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async deleteNewsletter(req, res) {
    try {
      const newsletterId = req.params.id;
      await NewsletterService.delete(newsletterId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getNewslettersByAdminId(req, res) {
    try {
      const adminId = req.params.adminId;
      const newsletters = await NewsletterService.getByAdminId(adminId);
      res.status(200).json(newsletters);
    } catch (error) {
      console.error("Error fetching newsletters by admin ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async deleteAllNewsletters(req, res) {
    try {
      await NewsletterService.deleteAll();
      res.status(200).json({ message: "All newsletters deleted" });
    } catch (error) {
      console.error("Error deleting newsletters:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
