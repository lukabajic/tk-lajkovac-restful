const mongoose = require("mongoose");

const { Schema } = mongoose;

const scheduleSubSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  scheduleId: {
    type: Schema.Types.ObjectId,
    required: true,
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
  isAdmin: {
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
