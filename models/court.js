const mongoose = require("mongoose");

const { Schema } = mongoose;

const mongoSchema = new Schema({
  number: {
    type: Number,
  },
  times: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
  ],
});

const Court = mongoose.model("Court", mongoSchema);

module.exports = Court;
