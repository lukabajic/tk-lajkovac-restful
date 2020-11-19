const Schedule = require("../models/schedule");
const Court = require("../models/court");

const getDates = require("./utility/getDates");
const scheduleData = require("./utility/scheduleData");

const { throwError, catchError } = require("./utility/errors");

exports.midnightUpdate = async () => {
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

    const timeToSchedule = schedule.courts[+court].find(
      (el) => el.start === time
    );
    !timeToSchedule && throwError("Termin nije pronađen.", 404);

    if (action === "cancel") {
      !timeToSchedule.taken && throwError("Termin nije zauzet.", 404);

      timeToSchedule.taken = false;
      timeToSchedule.userId = null;
    } else {
      timeToSchedule.taken && throwError("Termin je već zauzet.", 404);

      timeToSchedule.taken = true;
      timeToSchedule.userId = userId;
    }

    await schedule.save();

    res.status(200).json({
      statusCode: 200,
      message: `Termin je uspšno ${action === "cancel" ? "ot" : ""}zakazan.`,
      date: date.toDateString(),
      court,
      time: timeToSchedule,
    });
  } catch (err) {
    catchError(res, err);
  }
};
