const mongoose = require("mongoose");

const { Schema } = mongoose;

const subSchema = new Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  taken: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, default: null },
});

const mongoSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  courts: {
    1: [subSchema],
    2: [subSchema],
    3: [subSchema],
  },
});

const Schedule = mongoose.model("Schedule", mongoSchema);

module.exports = Schedule;
