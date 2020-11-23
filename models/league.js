const mongoose = require("mongoose");

const { Schema } = mongoose;

const participantSubSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: Schema.Types.ObjectId,
    required,
  },
  matches: [fixtureSubSchema],
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

const fixtureSubSchema = new Schema({
  played: {
    type: Boolean,
    default: false,
  },
  participantOne: participantSubSchema,
  participantTwo: participantSubSchema,
  participantOneGames: {
    type: Number,
    default: 0,
  },
  participantTwoGames: {
    type: Number,
    default: 0,
  },
});

const groupSubSchema = new Schema({
  leagueId: {
    type: Schema.Types.ObjectId,
    required,
  },
  participants: [participantSubSchema],
  fixtures: [fixtureSubSchema],
});

const leagueSchema = new Schema({
  name: {
    type: String,
    required,
  },
  start: {
    type: String,
    required,
  },
  end: {
    type: String,
    required,
  },
  groups: [groupSubSchema],
});

const League = mongoose.model("League", leagueSchema);

module.exports = League;
