const getDates = require("./getDates");

const removeId = (time) => ({
  taken: time.taken,
  userId: time.userId,
  start: time.start,
  end: time.end,
});

module.exports = scheduleData = (schedule) => {
  const { today, tomorrow, dayAfter } = getDates();

  const todaySchedule = schedule.find((day) => day.date === today);
  const tomorrowSchedule = schedule.find((day) => day.date === tomorrow);
  const dayAfterSchedule = schedule.find((day) => day.date === dayAfter);

  return {
    today: {
      courts: {
        1: todaySchedule.courts["1"].map((time) => removeId(time)),
        2: todaySchedule.courts["2"].map((time) => removeId(time)),
        3: todaySchedule.courts["3"].map((time) => removeId(time)),
      },
      date: todaySchedule.date,
    },
    tomorrow: {
      courts: {
        1: tomorrowSchedule.courts["1"].map((time) => removeId(time)),
        2: tomorrowSchedule.courts["2"].map((time) => removeId(time)),
        3: tomorrowSchedule.courts["3"].map((time) => removeId(time)),
      },
      date: tomorrowSchedule.date,
    },
    dayAfter: {
      courts: {
        1: dayAfterSchedule.courts["1"].map((time) => removeId(time)),
        2: dayAfterSchedule.courts["2"].map((time) => removeId(time)),
        3: dayAfterSchedule.courts["3"].map((time) => removeId(time)),
      },
      date: dayAfterSchedule.date,
    },
  };
};
