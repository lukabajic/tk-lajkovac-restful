const getDates = () => {
  const today = new Date();
  const yesterday = new Date();
  const tomorrow = new Date();
  const dayAfter = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  tomorrow.setDate(tomorrow.getDate() + 1);
  dayAfter.setDate(dayAfter.getDate() + 2);

  return {
    today: today.toDateString(),
    tomorrow: tomorrow.toDateString(),
    dayAfter: dayAfter.toDateString(),
    yesterday: yesterday.toDateString(),
  };
};

module.exports = getDates;
