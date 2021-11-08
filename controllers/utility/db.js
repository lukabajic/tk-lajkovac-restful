const bcrypt = require('bcryptjs');

const League = require('../../models/league');
const User = require('../../models/user');
const DummyUser = require('../../models/dummyUser');
const ScheduleDay = require('../../models/scheduleDay');
const CourtSchedule = require('../../models/courtSchedule');

const { throwError } = require('./errors');
const getDates = require('./getDates');

exports.allGroupMatches = (participants) => {
  const fixtures = [];

  for (let first = 0; first < participants.length; first++) {
    for (let second = first + 1; second < participants.length; second++) {
      fixtures.push({
        participantOne: participants[first].name,
        participantTwo: participants[second].name,
        participantOneId: participants[first].userId,
        participantTwoId: participants[second].userId,
      });
    }
  }

  return fixtures;
};

exports.allParticipantMatches = (participants, participant) => {
  const opponents = participants.filter(
    (el) => el.userId.toString() !== participant.userId.toString()
  );
  const fixtures = [];

  opponents.forEach((opponent) => {
    fixtures.push({
      opponent: {
        name: opponent.name,
        userId: opponent.userId,
      },
    });
  });

  return fixtures;
};

exports.scoreboard = (participants) => {
  participants.sort((first, second) => {
    if (first.totals.wins === second.totals.wins) {
      const firstDifference = first.totals.gamesWon - first.totals.gamesLost;
      const secondDifference = second.totals.gamesWon - second.totals.gamesLost;

      if (firstDifference === secondDifference) {
        return 0;
      }

      return firstDifference > secondDifference ? -1 : 1;
    }

    return first.totals.wins > second.totals.wins ? -1 : 1;
  });

  const scoreboard = participants.map((el, i) => ({
    place: i,
    participant: el,
  }));

  return scoreboard;
};

exports.leagueExists = async (name) => {
  const check = await League.findOne({ name });
  check && throwError('Liga sa tim imenom već postoji.', 409);
};

exports.getLeague = async (name) => {
  const league = await League.findOne({ name });
  !league && throwError('Liga sa tim imenom ne postoji.', 404);

  return league;
};

exports.getAllLeagues = async () => {
  const leagues = await League.find();
  !leagues && throwError('Nijedna liga ne postoji.', 404);

  return leagues;
};

exports.groupExists = (league, groupName) => {
  const check = league.groups.find((el) => el.name === groupName);
  check && throwError('Grupa sa tim imenom već postoji.', 400);
};

exports.anyGroups = (league) => {
  !league.groups.length &&
    throwError('Ne postoji ni jedna grupa u ovoj ligi.', 400);
};

exports.getGroup = (league, groupName) => {
  const group = league.groups.find((el) => el.name === groupName);
  !group && throwError('Grupa sa tim imenom ne postoji.', 400);

  return group;
};

exports.getParticipant = (group, participantId) => {
  const participant = group.participants.find(
    (el) => el.userId.toString() === participantId
  );
  !participant && throwError('Učesnik ne postoji.', 404);

  return participant;
};

exports.participantExists = async (groupArg, participantId) => {
  const leagues = await League.find();
  leagues.forEach((league) => {
    league.groups.forEach((group) => {
      group.participants.forEach((participant) => {
        participant.userId.toString() === participantId &&
          throwError('Učesnik postoji u drugoj grupi ili ligi.', 409);
      });
    });
  });

  const participant = groupArg.participants.find(
    (el) => el.userId.toString() === participantId
  );
  participant && throwError('Učesnik već u grupi.', 409);
};

exports.getSchedule = async (date) => {
  const scheduleDay = await ScheduleDay.findOne({ date });
  !scheduleDay && throwError(`Raspored za ${date} ne postoji.`, 404);

  return scheduleDay;
};

exports.getAllSchedues = async () => {
  const dates = getDates();

  const scheduleDays = await ScheduleDay.find({
    date: [dates.today, dates.tomorrow, dates.dayAfter],
  });
  !scheduleDays && throwError(`Raspored ne postoji.`, 404);

  return scheduleDays;
};

exports.scheduleExists = async (date) => {
  const check = await ScheduleDay.findOne({ date });
  check && throwError(`Raspored za ${date} već postoji.`, 409);
};

exports.getScheduleDayCourt = (scheduleDay, court) => {
  const courtToUpdate = scheduleDay.courts.find((el) => el.number === court);
  !courtToUpdate && throwError(`Teren broj ${court} ne postoji.`, 404);

  return courtToUpdate;
};

exports.getScheduleDayTime = (court, time) => {
  const timeToUpdate = court.times.find((el) => el.start === time);
  !timeToUpdate &&
    throwError(
      `Termin u ${time.slice(0, 2)}.${time.slice(2, 4)} ne postoji.`,
      404
    );

  return timeToUpdate;
};

exports.isTimeTaken = (time) => {
  time.taken &&
    throwError(
      `Termin  ${time.start.slice(0, 2)}.${time.start.slice(
        2,
        4
      )} je već zakazan.`,
      409
    );
};

exports.isTimeNotTaken = (time) => {
  !time.taken &&
    throwError(
      `Termin  ${time.start.slice(0, 2)}.${time.start.slice(
        2,
        4
      )} nije zakazan.`,
      404
    );
};

exports.getAllCourts = async () => {
  const courts = await CourtSchedule.find().sort({ number: 'asc' });
  !courts && throwError('Nije pronađen nijedan teren.', 404);

  return courts;
};

exports.userExists = async (email) => {
  const check = await User.findOne({ email });
  check && throwError('Email se je već u upotrebi.', 409);
};

exports.getUser = async (id) => {
  const user = await User.findById(id);
  !user && throwError('Korisnik ne postoji u našoj bazi.', 404);

  return user;
};

exports.deleteUser = async (email) => {
  await User.deleteOne({ email });
};

exports.getDummyUser = async (id) => {
  const user = await DummyUser.findById(id);
  !user && throwError('Korisnik ne postoji u našoj bazi.', 404);

  return user;
};

exports.getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  !user && throwError('Email ne postoji u našoj bazi.', 404);

  return user;
};

exports.getUsers = async () => {
  const users = await User.find();
  !users && throwError('Došlo je do greške prilikom pretrage korisnika.', 404);

  return users;
};

exports.listUsers = async ({ limit, offset }) => {
  const users = await User.find({ emailVerified: true })
    .skip(offset)
    .limit(limit);
  !users && throwError('Došlo je do greške prilikom pretrage korisnika.', 404);

  return users;
};

exports.getDummyUsers = async () => {
  const users = await DummyUser.find().select('-__v');
  !users && throwError('Došlo je do greške prilikom pretrage korisnika.', 404);

  return users;
};

exports.passwordMatches = async (enteredPassword, userPassword) => {
  const passwordsMatch = await bcrypt.compare(enteredPassword, userPassword);
  !passwordsMatch && throwError('Uneli ste pogrešnu lozinku.', 401);
};

exports.courtScheduleExists = async (number) => {
  const check = await CourtSchedule.findOne({ number });
  check && throwError('Teren već ima raspored termina.', 409);
};

exports.getCourt = async (number) => {
  const courtSchedule = await CourtSchedule.findOne({ number });
  !courtSchedule && throwError(`Teren broj ${number} ne postoji.`, 404);

  return courtSchedule;
};
