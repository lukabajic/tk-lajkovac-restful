const express = require("express");

const scheduleController = require("../controllers/schedule");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/get", isAuth, scheduleController.getSchedule);

module.exports = router;
