const io = require("../socket");

const Schedule = require("../models/schedule");
const User = require("../models/user");
const Court = require("../models/court");

const getDates = require("./utility/getDates");
const scheduleData = require("./utility/scheduleData");
const { userData } = require("./utility/user");

const { throwError, catchError } = require("./utility/errors");

exports.midnightUpdateSchedule = async () => {
  const { yesterday, dayAfter } = getDates();

  await Schedule.deleteOne({ date: yesterday });

  const court1 = await Court.findOne({ number: 1 });
  const court2 = await Court.findOne({ number: 2 });
  const court3 = await Court.findOne({ number: 3 });

  const dayAfterSchedule = new Schedule({
    date: dayAfter,
    courts: { 1: court1.times, 2: court2.times, 3: court3.times },
  });
  await dayAfterSchedule.save();
};

exports.getSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.find();
    !schedule && throwError("Raspored nije pronađen.", 404);

    res.status(200).json({
      statusCode: 200,
      message: "Raspored je uspešno pronađen.",
      schedule: scheduleData(schedule),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.scheduleTime = async (req, res, next) => {
  const { userId } = req;
  const { action, court, time, day } = req.body;

  const date = new Date(new Date().setDate(new Date().getDate() + day));

  try {
    const schedule = await Schedule.findOne({ date: date.toDateString() });
    !schedule && throwError("Raspored nije pronađen.", 404);

    const user = await User.findById(userId);
    !user && throwError("Korisnik ne postoji u našoj bazi.", 404);

    const timeToSchedule = schedule.courts[+court].find(
      (el) => el.start === time
    );
    !timeToSchedule && throwError("Termin nije pronađen.", 404);

    if (action === "cancel") {
      !timeToSchedule.taken && throwError("Termin nije zauzet.", 404);

      timeToSchedule.taken = false;
      timeToSchedule.userId = null;
      user.scheduled[day] = false;
    } else {
      timeToSchedule.taken && throwError("Termin je već zauzet.", 404);

      timeToSchedule.taken = true;
      timeToSchedule.userId = userId;
      user.scheduled[day] = { court, time };
    }

    await schedule.save();
    const result = await Schedule.find();

    const resultUser = await user.save();

    io.get().emit("schedule", {
      action: "time",
      user: userData(resultUser),
      schedule: scheduleData(result),
    });

    res.status(200).json({
      statusCode: 200,
      message: `Termin je uspšno ${action === "cancel" ? "ot" : ""}zakazan.`,
      schedule: scheduleData(result),
      user: userData(resultUser),
    });
  } catch (err) {
    catchError(res, err);
  }
};
