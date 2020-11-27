const DummyUser = require("../models/dummyUser");

const { catchError } = require("./utility/errors");
const db = require("./utility/db");

exports.addParticipant = async (req, res, next) => {
  const { leagueName, groupName, participantName, participantId } = req.body;

  try {
    const league = await db.getLeague(leagueName);

    const group = db.getGroup(league, groupName);

    db.participantExists(group, participantId);

    group.participants.push({ name: participantName, userId: participantId });

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `${participantName} je dodat u grupu ${groupName}, lige ${leagueName}.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getParticipant = async (req, res, next) => {
  const { leagueName, groupName, participantId } = req.query;

  try {
    const league = await db.getLeague(decodeURI(leagueName));

    const group = db.getGroup(league, decodeURI(groupName));

    const participant = db.getParticipant(group, participantId);

    res.status(200).json({
      statusCode: 200,
      participant,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllParticipants = async (req, res, next) => {
  const { leagueName, groupName } = req.query;

  try {
    const league = await db.getLeague(decodeURI(leagueName));

    const group = db.getGroup(league, decodeURI(groupName));

    res.status(200).json({
      statusCode: 200,
      participants: group.participants,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editParticipant = async (req, res, next) => {
  const { leagueName, groupName, participantId, action, payload } = req.body;

  try {
    const league = await db.getLeague(leagueName);

    const group = db.getGroup(league, groupName);

    const participant = db.getParticipant(group, participantId);

    switch (action) {
      case "UPDATE_TOTALS":
        participant.totals = payload.totals;
        break;
      default:
        break;
    }

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: "Novi podaci za učesnika uspešno sačuvani.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteParticipant = async (req, res, next) => {
  const { leagueName, groupName, participantId } = req.query;

  try {
    const league = await db.getLeague(leagueName);

    const group = db.getGroup(league, groupName);

    db.getParticipant(group, participantId);

    group.participants = group.participants.filter(
      (el) => el.userId.toString() !== participantId
    );

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: "Učesnik uspešno obrisan.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.createDummyUser = async (req, res, next) => {
  const { leagueName, groupName, participantName, participantPhone } = req.body;

  try {
    const dummyUser = await new DummyUser({
      data: { displayName: participantName, phone: participantPhone },
    }).save();

    const league = await db.getLeague(leagueName);

    const group = db.getGroup(league, groupName);

    db.participantExists(group, dummyUser._id);

    group.participants.push({
      name: dummyUser.data.displayName,
      userId: dummyUser._id,
    });

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `${participantName} je dodat u grupu ${groupName}, lige ${leagueName}.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};
