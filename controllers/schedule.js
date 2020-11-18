const Schedule = require("../models/schedule");
const { court1, court2, court3 } = require("../models/test");

const getDates = require("./utility/getDates");

exports.midnightUpdate = async () => {
  const { yesterday, dayAfter } = getDates();

  await Schedule.deleteOne({ date: yesterday });

  const dayAfterSchedule = new Schedule({
    date: dayAfter,
    courts: { 1: court1, 2: court2, 3: court3 },
  });
  await dayAfterSchedule.save();
};
