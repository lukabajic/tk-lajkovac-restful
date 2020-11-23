const express = require("express");

const courtScheduleController = require("../controllers/courtSchedule");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.put("/create", isAuth, courtScheduleController.createCourtSchedule);

router.get("/get", isAuth, courtScheduleController.getCourtSchedule);

router.post("/edit", isAuth, courtScheduleController.editCourtSchedule);

router.delete("/delete", isAuth, courtScheduleController.deleteCourtSchedule);

module.exports = router;
