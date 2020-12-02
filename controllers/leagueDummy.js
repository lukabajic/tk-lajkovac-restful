const DummyUser = require("../models/dummyUser");

const { catchError } = require("./utility/errors");
const { userData } = require("./utility/userData");
const db = require("./utility/db");

exports.createDummyUser = async (req, res, next) => {
  const { leagueName, groupName, participantName, participantPhone } = req.body;

  try {
    const dummyUser = await new DummyUser({
      data: { displayName: participantName, phone: participantPhone },
    }).save();

    const league = await db.getLeague(leagueName);

    const group = db.getGroup(league, groupName);

    await db.participantExists(group, dummyUser._id);

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

exports.getDummyUser = async (req, res, next) => {
  const { dummyId } = req.query;

  try {
    const user = await db.getDummyUser(dummyId);

    res.status(200).json({
      statusCode: 200,
      message: "Korisnik je uspešno pronadjen.",
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllDummyUsers = async (req, res, next) => {
  try {
    const users = await db.getDummyUsers();

    res.status(201).json({
      statusCode: 201,
      message: "List svih korisnika je pronađena.",
      users: users.map((user) => userData(user)),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.updateDummyUserData = async (req, res, next) => {
  const { dummyId, action, payload } = req.body;

  try {
    const user = await db.getDummyUser(dummyId);

    switch (action) {
      case "UPDATE_NAME":
        user.data.displayName = payload.displayName;
        break;
      case "UPDATE_PHONE":
        user.data.phone = payload.phone;
        break;
      default:
        break;
    }

    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Podaci uspešno sačuvani.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteDummyUser = async (req, res, next) => {
  const { dummyId } = req.query;

  try {
    const user = await db.getDummyUser(dummyId);

    await user.remove();

    res.status(200).json({
      statusCode: 200,
      message: "Korisnik obrisan.",
    });
  } catch (err) {
    catchError(res, err);
  }
};
