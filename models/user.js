const mongoose = require("mongoose");

const { Schema } = mongoose;

const fixturesSubSchema = new Schema({
  opponent: {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  score: {
    playerGames: {
      type: Number,
      default: 0,
    },
    opponentGames: {
      type: Number,
      default: 0,
    },
  },
});

const scheduleSubSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  court: {
    type: Number,
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
  additionalData: {},
  schedule: [scheduleSubSchema],
  league: {
    leagueName: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
      default: "",
    },
    fixtures: [fixturesSubSchema],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
