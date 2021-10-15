const io = require('../socket');

const ScheduleDay = require('../models/scheduleDay');

const getDates = require('./utility/getDates');

const { catchError } = require('./utility/errors');
const db = require('./utility/db');
const { userData } = require('./utility/userData');

exports.createScheduleDay = async (req, res, next) => {
  const { day } = req.body;

  const dates = getDates();

  try {
    await db.scheduleExists(dates[day]);

    const courts = await db.getAllCourts();

    const scheduleDay = new ScheduleDay({
      date: dates[day],
      courts: courts,
    });
    await scheduleDay.save();

    io.get().emit('schedule', {
      action: 'create',
      scheduleDay,
    });

    res.status(201).json({
      statusCode: 201,
      message: `Novi raspored za ${dates[day]} je uspešno napravljen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getScheduleDay = async (req, res, next) => {
  const { day } = req.query;

  const dates = getDates();

  try {
    const scheduleDay = await db.getSchedule(dates[day]);

    res.status(200).json({
      statusCode: 200,
      scheduleDay,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllScheduleDays = async (req, res, next) => {
  try {
    const scheduleDays = await db.getAllSchedues();

    res.status(200).json({
      statusCode: 200,
      scheduleDays,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getQuickSchedule = async (req, res, next) => {
  try {
    const scheduleDays = await db.getAllSchedues();

    if (
      !scheduleDays ||
      (Array.isArray(scheduleDays) && scheduleDays.length === 0)
    ) {
      res.status(200).json({
        statusCode: 200,
        times: [],
      });
    }

    const courts = scheduleDays.find(
      (d) => d.date === new Date().toDateString()
    ).courts;

    const times = [];

    courts.forEach((c) =>
      c.times.forEach((t) => {
        if (t.taken) return;

        const hours = new Date().getHours();
        const startHour = Number(t.start.slice(0, 2));

        if (hours === startHour) {
          const minutes = new Date().getMinutes();
          const startMinute = Number(t.start.slice(2, 4));

          if (minutes > startMinute + 30 * 60000) return;
        }

        if (hours > startHour) return;

        times.push({
          taken: t.taken,
          userId: t.userId,
          userName: t.userName,
          _id: t._id,
          start: t.start,
          end: t.end,
          court: c.number,
        });
      })
    );

    times.sort((a, b) => {
      const aHours = Number(a.start.slice(0, 2));
      const bHours = Number(b.start.slice(0, 2));
      const aMinutes = Number(a.start.slice(2, 4));
      const bMinutes = Number(b.start.slice(2, 4));

      if (aHours === bHours) return aMinutes - bMinutes;

      return aHours - bHours;
    });

    res.status(200).json({
      statusCode: 200,
      times: times.slice(0, 3),
    });
  } catch (err) {
    console.log(err);
    catchError(res, err);
  }
};

exports.adminEditSchedule = async (req, res) => {
  const { day, court, start: time, userName, action } = req.body;

  const dates = getDates();

  try {
    const scheduleDay = await db.getSchedule(dates[day]);

    const courtToUpdate = db.getScheduleDayCourt(scheduleDay, court);

    const timeToUpdate = db.getScheduleDayTime(courtToUpdate, time);

    if (action === 'cancel') {
      db.isTimeNotTaken(timeToUpdate);

      timeToUpdate.taken = false;
      timeToUpdate.userName = null;
    } else {
      db.isTimeTaken(timeToUpdate);

      timeToUpdate.taken = true;
      timeToUpdate.userName = userName;
    }

    const editedScheduleDay = await scheduleDay.save();

    io.get().emit('schedule', {
      action: 'edit',
      scheduleDay: editedScheduleDay,
    });

    res.status(200).json({
      statusCode: 200,
      message: `Termin uspešno ${action === 'cancel' ? 'otkazan' : 'zakazan'}.`,
      editedScheduleDay,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editDaySchedule = async (req, res, next) => {
  const { day, court, start: time, action } = req.body;
  const { userId } = req;

  const dates = getDates();

  try {
    const user = await db.getUser(userId);

    const scheduleDay = await db.getSchedule(dates[day]);

    const courtToUpdate = db.getScheduleDayCourt(scheduleDay, court);

    const timeToUpdate = db.getScheduleDayTime(courtToUpdate, time);

    if (action === 'cancel') {
      db.isTimeNotTaken(timeToUpdate);

      timeToUpdate.taken = false;
      timeToUpdate.userId = null;

      user.schedule = user.schedule.filter(
        (time) => time.scheduleId === timeToUpdate._id
      );
    } else {
      db.isTimeTaken(timeToUpdate);

      timeToUpdate.taken = true;
      timeToUpdate.userId = userId;

      user.schedule.push({
        date: dates[day],
        court,
        time,
        scheduleId: timeToUpdate._id,
      });
    }

    const editedScheduleDay = await scheduleDay.save();
    const editedUser = await user.save();

    io.get().emit('schedule', {
      action: 'edit',
      scheduleDay: editedScheduleDay,
      user: userData(editedUser),
    });

    res.status(200).json({
      statusCode: 200,
      message: `Termin uspešno ${action === 'cancel' ? 'otkazan' : 'zakazan'}.`,
      editedScheduleDay,
      editedUser,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteScheduleDay = async (req, res, next) => {
  const { day } = req.query;

  const dates = getDates();

  try {
    const scheduleDay = await db.getSchedule(dates[day]);

    await scheduleDay.remove();

    io.get().emit('schedule', {
      action: 'delete',
      date: scheduleDay.date,
    });

    res.status(200).json({
      statusCode: 200,
      message: `Raspored za ${dates[day]} je uspešno obrisan.`,
    });
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
  } catch (err) {
    console.warn(err);
  }
};

// exports.getSchedule = async (req, res, next) => {
//   try {
//     const schedule = await Schedule.find();
//     !schedule && throwError("Raspored nije pronađen.", 404);

//     res.status(200).json({
//       statusCode: 200,
//       message: "Raspored je uspešno pronađen.",
//       schedule: scheduleData(schedule),
//     });
//   } catch (err) {
//     catchError(res, err);
//   }
// };

// exports.scheduleTime = async (req, res, next) => {
//   const { userId } = req;
//   const { action, court, time, day } = req.body;

//   const date = new Date(new Date().setDate(new Date().getDate() + day));

//   try {
//     const schedule = await Schedule.findOne({ date: date.toDateString() });
//     !schedule && throwError("Raspored nije pronađen.", 404);

//     const user = await User.findById(userId);
//     !user && throwError("Korisnik ne postoji u našoj bazi.", 404);

//     const timeToSchedule = schedule.courts[+court].find(
//       (el) => el.start === time
//     );
//     !timeToSchedule && throwError("Termin nije pronađen.", 404);

//     if (action === "cancel") {
//       !timeToSchedule.taken && throwError("Termin nije zauzet.", 404);

//       timeToSchedule.taken = false;
//       timeToSchedule.userId = null;
//       user.scheduled[day] = false;
//     } else {
//       timeToSchedule.taken && throwError("Termin je već zauzet.", 404);

//       timeToSchedule.taken = true;
//       timeToSchedule.userId = userId;
//       user.scheduled[day] = { court, time };
//     }

//     await schedule.save();
//     const result = await Schedule.find();

//     const resultUser = await user.save();

// io.get().emit("schedule", {
//   action: "time",
//   user: userData(resultUser),
//   schedule: scheduleData(result),
// });

//     res.status(200).json({
//       statusCode: 200,
//       message: `Termin je uspšno ${action === "cancel" ? "ot" : ""}zakazan.`,
//       schedule: scheduleData(result),
//       user: userData(resultUser),
//     });
//   } catch (err) {
//     catchError(res, err);
//   }
// };
