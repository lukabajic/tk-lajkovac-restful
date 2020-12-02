const League = require("../models/league");

const { catchError, throwError } = require("./utility/errors");
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

exports.leaguePublish = async (req, res, next) => {
  const { name } = req.body;

  try {
    const league = await db.getLeague(name);

    league.published && throwError(`Liga ${name} je već objavljena.`, 409);

    league.groups.length < 1 &&
      throwError(`Liga ${name} nema nijednu grupu`, 404);

    const users = await db.getUsers();
    const dummyUsers = await db.getDummyUsers();

    league.groups.forEach((group) => {
      group.participants.length < 2 &&
        throwError(
          `Grupa ${group.name} mora da ima više od jednog učesnika.`,
          404
        );

      group.fixtures = db.allGroupMatches(group.participants);

      group.participants.forEach(async (participant) => {
        const user = users.find((el) => {
          return el._id.toString() === participant.userId.toString();
        });

        if (!user) {
          const dummyUser = dummyUsers.find(
            (el) => el._id.toString() === participant.userId.toString()
          );
          dummyUser.league.leagueName = league.name;
          dummyUser.league.groupName = group.name;
          dummyUser.league.fixtures = db.allParticipantMatches(
            group.participants,
            participant
          );

          await dummyUser.save();
        } else {
          user.league.leagueName = league.name;
          user.league.groupName = group.name;
          user.league.fixtures = db.allParticipantMatches(
            group.participants,
            participant
          );

          await user.save();
        }
      });
      group.fixtures = db.allGroupMatches(group.participants);

      group.scoreboard = db.scoreboard(group.participants);
    });

    league.published = true;

    await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `Liga: ${name} je uspešno objavljena.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.matchScore = async (req, res, next) => {
  const { leagueName, groupName, fixtureId, oneGames, twoGames } = req.body;

  try {
    const league = await db.getLeague(leagueName);

    const group = await db.getGroup(league, groupName);

    const fixture = group.fixtures.find(
      (el) => el._id.toString() === fixtureId
    );

    fixture.participantOneGames = oneGames;
    fixture.participantTwoGames = twoGames;

    const participantOne = group.participants.find(
      (el) => el.userId.toString() === fixture.participantOneId.toString()
    );
    const participantTwo = group.participants.find(
      (el) => el.userId.toString() === fixture.participantTwoId.toString()
    );

    participantOne.totals = {
      wins:
        oneGames > twoGames
          ? participantOne.totals.wins + 1
          : participantOne.totals.wins,
      loses:
        oneGames < twoGames
          ? participantOne.totals.loses + 1
          : participantOne.totals.loses,
      gamesWon: participantOne.totals.gamesWon + oneGames,
      gamesLost: participantOne.totals.gamesLost + twoGames,
    };

    participantTwo.totals = {
      wins:
        oneGames < twoGames
          ? participantTwo.totals.wins + 1
          : participantTwo.totals.wins,
      loses:
        oneGames > twoGames
          ? participantTwo.totals.loses + 1
          : participantTwo.totals.loses,
      gamesWon: participantTwo.totals.gamesWon + twoGames,
      gamesLost: participantTwo.totals.gamesLost + oneGames,
    };

    group.scoreboard = db.scoreboard(group.participants);

    try {
      const userOne = await db.getUser(participantOne.userId);
      const userFixture = userOne.league.fixtures.find(
        (el) =>
          el.opponent.userId.toString() === fixture.participantTwoId.toString()
      );
      userFixture.score = {
        playerGames: oneGames,
        opponentGames: twoGames,
      };
      // await userOne.save();
    } catch {
      const dummyOne = await db.getDummyUser(participantOne.userId);
      const dummyFixture = dummyOne.league.fixtures.find(
        (el) =>
          el.opponent.userId.toString() === fixture.participantTwoId.toString()
      );
      dummyFixture.score = {
        playerGames: oneGames,
        opponentGames: twoGames,
      };
      // await dummyOne.save();
    }

    try {
      const userTwo = await db.getUser(participantTwo.userId);
      const userFixture = userTwo.league.fixtures.find(
        (el) =>
          el.opponent.userId.toString() === fixture.participantOneId.toString()
      );
      userFixture.score = {
        playerGames: twoGames,
        opponentGames: oneGames,
      };
      // await userTwo.save();
    } catch {
      const dummyTwo = await db.getDummyUser(participantTwo.userId);
      const dummyFixture = dummyTwo.league.fixtures.find(
        (el) =>
          el.opponent.userId.toString() === fixture.participantOneId.toString()
      );
      dummyFixture.score = {
        playerGames: twoGames,
        opponentGames: oneGames,
      };
      // await dummyTwo.save();
    }
    // await league.save();

    res.status(200).json({
      statusCode: 200,
      message: `Rezultat je uspešno objavljen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};
