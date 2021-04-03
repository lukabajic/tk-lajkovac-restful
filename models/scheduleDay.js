const mongoose = require("mongoose");

const { Schema } = mongoose;

const timeSubSchema = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  taken: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, default: null },
  userName: { type: String, default: null },
});

const scheduleSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  courts: [
    {
      number: {
        type: Number,
        required: true,
      },
      times: [timeSubSchema],
    },
  ],
});

const ScheduleDay = mongoose.model("ScheduleDay", scheduleSchema);

module.exports = ScheduleDay;
