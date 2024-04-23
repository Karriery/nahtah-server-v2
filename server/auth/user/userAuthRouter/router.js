const router = require("express").Router();
const userController = require("../userAuthController/controller.js");

router.post("/signup", userController.signUpUser);
router.post("/signin", userController.login);
router.post("/verify", userController.verify);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.delet);
router.put("/:id", userController.update);
router.post("/filterBanned", userController.filterBanned);
router.post("/forgetPassword", userController.sendMail);
router.post("/validateCode", userController.validateCode);
router.post("/resetPassword", userController.resetPassword);
router.post("/getByPhone", userController.getUsersAndAdminsByPhone);
module.exports = router;
