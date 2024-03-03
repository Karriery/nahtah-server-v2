const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController");

router.post("/", storeController.createStore);
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.get("/date", storeController.getStoreByDate);
router.put("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);

module.exports = router;
