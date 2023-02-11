const router = require("express").Router();
const adminController = require("../adminAuthController/controller.js");

router.post("/signup", adminController.signUpadmin);
router.post("/signin", adminController.login);
router.post("/verify", adminController.verify);
router.get("/", adminController.getAdmins);
router.delete("/:id", adminController.delet);
router.put("/:id", adminController.update);

module.exports = router;
