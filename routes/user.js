const express = require("express");

const userController = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/get", isAuth, userController.getUser);

router.post("/verify", isAuth, userController.verifyUser);

router.post("/resend", isAuth, userController.resendVerificationEmail);

module.exports = router;
