const express = require("express");
const router = express.Router();
const offDaysController = require("../controller/offDaysController");

router.post("/", offDaysController.create);
router.get("/", offDaysController.getAll);
router.get("/:id", offDaysController.getById);
router.get("/user/:userId", offDaysController.getByUserId);
router.post("/user", offDaysController.getByuserIdAndDate);
router.post("/date", offDaysController.getByDate);
router.put("/:id", offDaysController.update);
router.delete("/:id", offDaysController.delete);
router.delete("/", offDaysController.deleteAll);

module.exports = router;
