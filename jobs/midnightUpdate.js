// util
const { midnightUpdateSchedule } = require('./controllers/scheduleDay');
const { midnightUpdateUsers } = require('./controllers/user');
const { catchError } = require('./controllers/utility/errors');
const isAuth = require('./middleware/isAuth');

app.post('/api/v1/midnight-update', isAuth, async (req, res) => {
  try {
    const schedule = await midnightUpdateSchedule();
    const users = await midnightUpdateUsers();

    res.status(201).json({
      statusCode: 201,
      message: 'Schedule updated.',
      users,
      schedule,
    });
  } catch (err) {
    catchError(res, err);
  }
});

exports.midnightUpdateUsers = async (req, res, next) => {
  const { yesterday } = getDates();

  try {
    const users = await db.getUsers();

    users.forEach(async (user) => {
      user.schedule = user.schedule.filter((s) => s.date !== yesterday);
      await user.save();
    });

    return users;
  } catch (err) {
    catchError(res, err);
  }
};

exports.midnightUpdateSchedule = async () => {
  const { yesterday, dayAfter } = getDates();

  try {
    const courts = await db.getAllCourts();
    const yesterdaySchedule = await db.getSchedule(yesterday);

    const dayAfterSchedule = new ScheduleDay({
      date: dayAfter,
      courts,
    });

    await dayAfterSchedule.save();
    await yesterdaySchedule.remove();

    return await db.getAllSchedues();
  } catch (err) {
    catchError(res, err);
  }
};
