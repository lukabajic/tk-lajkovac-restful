const mongoose = require("mongoose");

const { Schema } = mongoose;

const mongoSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  courts: {
    1: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
        taken: { type: Boolean, default: false },
        userId: { type: Schema.Types.ObjectId, default: null },
      },
    ],
    2: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
        taken: { type: Boolean, default: false },
        userId: { type: Schema.Types.ObjectId, default: null },
      },
    ],
    3: [
      {
        start: { type: String, required: true },
        end: { type: String, required: true },
        taken: { type: Boolean, default: false },
        userId: { type: Schema.Types.ObjectId, default: null },
      },
    ],
  },
});

const Schedule = mongoose.model("Schedule", mongoSchema);

module.exports = Schedule;
