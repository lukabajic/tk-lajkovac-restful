const express = require("express");

const userController = require("../controllers/user");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/get", isAuth, userController.getUser);

module.exports = router;
