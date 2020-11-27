const { catchError } = require("./utility/errors");
const db = require("./utility/db");

exports.createGroup = async (req, res, next) => {
  const { leagueName, groupName } = req.body;

  try {
    const league = await db.getLeague(leagueName);

    db.groupExists(league, groupName);

    league.groups.push({ name: groupName });

    await league.save();

    res.status(201).json({
      statusCode: 201,
      message: `Grupa: ${groupName} je uspešno napravljena u ligi ${leagueName}.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getGroup = async (req, res, next) => {
  const { leagueName, groupName } = req.query;

  try {
    const league = await db.getLeague(decodeURI(leagueName));

    const group = db.getGroup(league, decodeURI(groupName));

    res.status(200).json({
      statusCode: 200,
      group,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllGroups = async (req, res, next) => {
  const { leagueName } = req.body;

  try {
    const league = await db.getLeague(leagueName);

    db.anyGroups(league);

    res.status(200).json({
      statusCode: 200,
      groups: league.groups,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editGroup = async (req, res, next) => {
  const { leagueName, groupName, action, payload } = req.body;

  try {
    const league = await db.getLeague(leagueName);

    const group = db.getGroup(league, groupName);

    switch (action) {
      case "UPDATE_GROUP_NAME":
        group.name = payload.name;
        break;
      default:
        break;
    }

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: "Novi podaci za grupu uspešno sačuvani.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteGroup = async (req, res, next) => {
  const { leagueName, groupName } = req.query;

  try {
    const league = await db.getLeague(decodeURI(leagueName));

    db.getGroup(league, decodeURI(groupName));

    league.groups = league.groups.filter(
      (el) => el.name !== decodeURIgroupName
    );

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `Grupa: ${decodeURI(
        groupName
      )} je uspešno obrisana iz lige ${decodeURI(leagueName)}.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};
