const express = require('express');

const scheduleDayController = require('../controllers/scheduleDay');

const isAuth = require('../middleware/isAuth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.put('/create', isAuth, isAdmin, scheduleDayController.createScheduleDay);

router.put(
  '/create-monthly',
  isAuth,
  isAdmin,
  scheduleDayController.createMonthlySchedule
);

router.get('/get', isAuth, scheduleDayController.getScheduleDay);

router.get('/get-all', isAuth, scheduleDayController.getAllScheduleDays);

router.get('/get-quick', isAuth, scheduleDayController.getQuickSchedule);
``
router.post('/edit', isAuth, scheduleDayController.editDaySchedule);

router.post(
  '/edit-admin',
  isAuth,
  isAdmin,
  scheduleDayController.adminEditSchedule
);

router.delete(
  '/delete',
  isAuth,
  isAdmin,
  scheduleDayController.deleteScheduleDay
);

module.exports = router;
