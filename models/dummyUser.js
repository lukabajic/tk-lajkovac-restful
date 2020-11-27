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

const dummyUserSchema = new Schema({
  data: {
    displayName: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
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

const DummyUser = mongoose.model("DummyUser", dummyUserSchema);

module.exports = DummyUser;
