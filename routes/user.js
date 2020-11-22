const express = require("express");

const userController = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/get", isAuth, userController.getUser);

router.get("/get-all", isAuth, userController.getAllUsers);

router.post("/verify", isAuth, userController.verifyUser);

router.post("/resend", isAuth, userController.resendVerificationEmail);

router.post("/update", isAuth, userController.updateUserData);

module.exports = router;
