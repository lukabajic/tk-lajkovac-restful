const mongoose = require("mongoose");

const { Schema } = mongoose;

const scheduleSubSchema = new Schema({
  date: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "",
  },
  scheduleId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  data: {
    displayName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  schedule: [scheduleSubSchema],
  league: {
    leagueId: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
