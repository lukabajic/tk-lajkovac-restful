const Schedule = require("../models/schedule");
const Court = require("../models/court");

const getDates = require("./utility/getDates");

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
