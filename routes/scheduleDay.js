const express = require("express");

const scheduleDayController = require("../controllers/scheduleDay");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.put("/create", isAuth, scheduleDayController.createScheduleDay);

router.get("/get", isAuth, scheduleDayController.getScheduleDay);

router.get("/get-all", isAuth, scheduleDayController.getAllScheduleDays);

router.post("/edit", isAuth, scheduleDayController.editDaySchedule);

router.delete("/delete", isAuth, scheduleDayController.deleteScheduleDay);

module.exports = router;
