const League = require("../models/league");

const { catchError } = require("./utility/errors");
const db = require("./utility/db");

exports.createLeague = async (req, res, next) => {
  const { name } = req.body;

  try {
    await db.leagueExists(name);

    const league = new League({ name });

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `Novi liga, ${name}, je uspešno napravljena.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getLeague = async (req, res, next) => {
  const { name } = req.query;

  try {
    const league = await db.getLeague(decodeURI(name));

    res.status(200).json({
      statusCode: 200,
      league,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllLeagues = async (req, res, next) => {
  try {
    const leagues = await db.getAllLeagues();

    res.status(200).json({
      statusCode: 200,
      leagues,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editLeague = async (req, res, next) => {
  const { name, action, payload } = req.body;

  try {
    const league = await db.getLeague(name);

    switch (action) {
      case "UPDATE_NAME":
        league.name = payload.name;
        break;
      case "UPDATE_DATES":
        league.start = payload.start;
        league.end = payload.end;
        break;
      default:
        break;
    }

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `Promene za ligu, ${name}, su uspešno sačuvane.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteLeague = async (req, res, next) => {
  const { name } = req.query;

  try {
    const league = await db.getLeague(decodeURI(name));

    await league.remove();

    res.status(200).json({
      statusCode: 200,
      message: `Liga: ${decodeURI(name)} je uspešno obrisana.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};
