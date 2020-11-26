const express = require("express");

const courtScheduleController = require("../controllers/courtSchedule");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.put(
  "/create",
  isAuth,
  isAdmin,
  courtScheduleController.createCourtSchedule
);

router.get("/get", isAuth, isAdmin, courtScheduleController.getCourtSchedule);

router.get(
  "/get-all",
  isAuth,
  isAdmin,
  courtScheduleController.getAllCourtSchedule
);

router.post(
  "/edit",
  isAuth,
  isAdmin,
  courtScheduleController.editCourtSchedule
);

router.delete(
  "/delete",
  isAuth,
  isAdmin,
  courtScheduleController.deleteCourtSchedule
);

module.exports = router;
