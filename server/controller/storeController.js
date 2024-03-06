const StoreService = require("../service/storeService");

module.exports = {
  async findOne(req, res) {
    try {
      const store = await StoreService.findOne();
      if (!store) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.status(200).json(store);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  async createStore(req, res) {
    try {
      const existingStore = await StoreService.findOne();

      if (existingStore) {
        await StoreService.delete(existingStore._id);
      }

      const newStore = await StoreService.create(req.body);
      res.status(201).json(newStore);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  async getAllStores(req, res) {
    try {
      const stores = await StoreService.getAll();
      const timeRanges = stores.map((store) => {
        const timeOpen = new Date(`2024-01-01T${store.timeOpen}`);
        const timeClose = new Date(`2024-01-01T${store.timeClose}`);
        const timeRanges = [];
        let currentTime = new Date(timeOpen);
        while (currentTime < timeClose) {
          const hour = currentTime.getHours().toString().padStart(2, "0");
          const minute = currentTime.getMinutes().toString().padStart(2, "0");
          timeRanges.push(`${hour}:${minute}`);
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        return timeRanges;
      });
      // Flatten the array of arrays
      const flattenedTimeRanges = timeRanges.flat();
      res.status(200).json(flattenedTimeRanges);
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
  async deleteAllStores(req, res) {
    try {
      await StoreService.DeleteAll();
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting stores:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
