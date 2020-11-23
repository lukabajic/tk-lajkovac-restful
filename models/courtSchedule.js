const mongoose = require("mongoose");

const { Schema } = mongoose;

const mongoSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  times: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
});

const CourtSchedule = mongoose.model("CourtSchedule", mongoSchema);

module.exports = CourtSchedule;
