const StoreService = require("../service/storeService");

module.exports = {
  async createStore(req, res) {
    try {
      const store = await StoreService.create(req.body);
      res.status(201).json(store);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getAllStores(req, res) {
    try {
      const stores = await StoreService.getAll();
      res.status(200).json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getStoreById(req, res) {
    try {
      const storeId = req.params.id;
      const store = await StoreService.getById(storeId);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.status(200).json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async getStoreByDate(req, res) {
    try {
      const date = req.params.date;
      const store = await StoreService.getByDate(date);
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.status(200).json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async updateStore(req, res) {
    try {
      const storeId = req.params.id;
      const updatedStore = await StoreService.update(storeId, req.body);
      res.status(200).json(updatedStore);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async deleteStore(req, res) {
    try {
      const storeId = req.params.id;
      await StoreService.delete(storeId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
