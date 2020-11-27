const mongoose = require("mongoose");

const { Schema } = mongoose;

const fixtureSubSchema = new Schema({
  played: {
    type: Boolean,
    default: false,
  },
  participantOne: {
    type: String,
    required: true,
  },
  participantTwo: {
    type: String,
    required: true,
  },
  participantOneGames: {
    type: Number,
    default: 0,
  },
  participantTwoGames: {
    type: Number,
    default: 0,
  },
});

const participantSubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  totals: {
    wins: {
      type: Number,
      default: 0,
    },
    loses: {
      type: Number,
      default: 0,
    },
    gamesWon: {
      type: Number,
      default: 0,
    },
    gamesLost: {
      type: Number,
      default: 0,
    },
  },
});

const participantRankSubSchema = new Schema({
  place: {
    type: Number,
    required: true,
  },
  participantId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const groupSubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [participantSubSchema],
  fixtures: [fixtureSubSchema],
  scoreboard: [participantRankSubSchema],
});

const leagueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  start: {
    type: String,
  },
  end: {
    type: String,
  },
  published: {
    type: Boolean,
    default: false,
  },
  groups: [groupSubSchema],
});

const League = mongoose.model("League", leagueSchema);

module.exports = League;
