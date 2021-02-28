const express = require("express");

const scheduleDayController = require("../controllers/scheduleDay");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.put("/create", isAuth, isAdmin, scheduleDayController.createScheduleDay);

router.get("/get", isAuth, scheduleDayController.getScheduleDay);

router.get("/get-all", isAuth, scheduleDayController.getAllScheduleDays);

router.post("/edit", isAuth, scheduleDayController.editDaySchedule);

router.delete(
  "/delete",
  isAuth,
  isAdmin,
  scheduleDayController.deleteScheduleDay
);

router.post("/midnight", scheduleDayController.midnightUpdateSchedule);

module.exports = router;
