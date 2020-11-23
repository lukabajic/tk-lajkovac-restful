const io = require("../socket");

const ScheduleDay = require("../models/scheduleDay");
const courtSchedule = require("../models/courtSchedule");
// const User = require("../models/user");

const getDates = require("./utility/getDates");

const { throwError, catchError } = require("./utility/errors");

exports.createScheduleDay = async (req, res, next) => {
  const { day } = req.body;

  const dates = getDates();

  try {
    const check = await ScheduleDay.findOne({ date: dates[day] });
    check && throwError(`Raspored za ${dates[day]} već postoji.`, 400);

    const courts = await courtSchedule.find().select("-_id -times._id -__v");
    !courts && throwError("Nije pronađen nijedan teren.", 400);

    const scheduleDay = new ScheduleDay({
      date: dates[day],
      courts: courts,
    });
    await scheduleDay.save();

    io.get().emit("schedule", {
      action: "create",
      scheduleDay,
    });

    res.status(200).json({
      statusCode: 200,
      message: `Novi raspored za ${dates[day]} je uspešno napravljen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getScheduleDay = async (req, res, next) => {
  const { day } = req.body;

  const dates = getDates();

  try {
    const scheduleDay = await ScheduleDay.findOne({ date: dates[day] }).select(
      "-_id -courts._id -courts.times._id -__v"
    );
    !scheduleDay && throwError(`Raspored za ${dates[day]} ne postoji.`, 400);

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
    const scheduleDays = await ScheduleDay.find().select(
      "-_id -courts._id -courts.times._id -__v"
    );
    !scheduleDays && throwError(`Raspored ne postoji.`, 400);

    res.status(200).json({
      statusCode: 200,
      scheduleDays,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editDaySchedule = async (req, res, next) => {
  const { day, court, time, action } = req.body;
  const { userId } = req;

  const dates = getDates();

  try {
    const scheduleDay = await ScheduleDay.findOne({ date: dates[day] });
    !scheduleDay && throwError(`Raspored za ${dates[day]} ne postoji.`, 400);

    const courtToUpdate = scheduleDay.courts.find((el) => el.number === court);
    !courtToUpdate && throwError(`Teren broj ${court} ne postoji.`, 400);

    const timeToUpdate = courtToUpdate.times.find((el) => el.start === time);
    !courtToUpdate &&
      throwError(
        `Termin u ${time.slice(0, 2)}.${time.slice(2, 4)} ne postoji.`,
        400
      );

    if (action === "cancel") {
      timeToUpdate.taken = false;
      timeToUpdate.userId = null;
    } else {
      timeToUpdate.taken = true;
      timeToUpdate.userId = userId;
    }

    const editedScheduleDay = await scheduleDay.save();

    io.get().emit("schedule", {
      action: "edit",
      editedScheduleDay,
    });

    res.status(200).json({
      statusCode: 200,
      message: `Termin uspešno ${action === "cancel" ? "otkazan" : "zakazan"}.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteScheduleDay = async (req, res, next) => {
  const { day } = req.body;

  const dates = getDates();

  try {
    const scheduleDay = await ScheduleDay.deleteOne({ date: dates[day] });
    !scheduleDay && throwError(`Raspored za ${dates[day]} ne postoji.`, 400);

    io.get().emit("schedule", {
      action: "delete",
      scheduleDay,
    });

    res.status(200).json({
      statusCode: 200,
      message: `Raspored za ${dates[day]} je uspešno obrisan.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

// exports.midnightUpdateSchedule = async () => {
//   const { yesterday, dayAfter } = getDates();

//   const court1 = await Court.findOne({ number: 1 });
//   const court2 = await Court.findOne({ number: 2 });
//   const court3 = await Court.findOne({ number: 3 });

//   const dayAfterSchedule = new Schedule({
//     date: dayAfter,
//     courts: { 1: court1.times, 2: court2.times, 3: court3.times },
//   });
//   await dayAfterSchedule.save();
// };

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
