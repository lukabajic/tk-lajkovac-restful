const express = require("express");

const userController = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/get", isAuth, userController.getUser);

router.get("/get-all", isAuth, userController.getAllUsers);

router.get("/verify-email/:token", userController.verifyUserEmail);

router.post("/resend", isAuth, userController.resendVerificationEmail);

router.post("/edit", isAuth, userController.updateUserData);

router.post("/reset-password", userController.resetPassword);

router.delete("/delete", isAuth, userController.deleteUser);

module.exports = router;
