const express = require("express");
const router = express.Router();
const storeController = require("../controller/storeController");

router.post("/", storeController.createStore);
router.get("/", storeController.getAllStores);
router.get("/:id", storeController.getStoreById);
router.post("/findOne", storeController.findOne);
router.put("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);
router.delete("/", storeController.deleteAllStores);

module.exports = router;
