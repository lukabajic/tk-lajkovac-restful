const CourtSchedule = require("../models/courtSchedule");

const db = require("./utility/db");
const { catchError } = require("./utility/errors");

exports.createCourtSchedule = async (req, res, next) => {
  const { times, number } = req.body;

  try {
    await db.courtScheduleExists(number);

    const courtSchedule = new CourtSchedule({ number, times });
    await courtSchedule.save();

    res.status(200).json({
      statusCode: 200,
      message: `Novi raspored za teren ${number} je uspešno napravljen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getCourtSchedule = async (req, res, next) => {
  const { number } = req.query;

  try {
    const courtSchedule = await db.getCourt(number);

    res.status(200).json({
      statusCode: 200,
      courtSchedule,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllCourtSchedule = async (req, res, next) => {
  try {
    const courtSchedules = await db.getAllCourts();

    res.status(200).json({
      statusCode: 200,
      courtSchedules,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editCourtSchedule = async (req, res, next) => {
  const { times, number } = req.body;

  try {
    const courtSchedule = await db.getCourt(number);

    courtSchedule.times = times;

    await courtSchedule.save();

    res.status(200).json({
      statusCode: 200,
      message: `Raspored za teren ${number} je uspešno promenjen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteCourtSchedule = async (req, res, next) => {
  const { number } = req.query;

  try {
    const courtSchedule = await db.getCourt(number);

    courtSchedule.remove();

    res.status(200).json({
      statusCode: 200,
      message: `Raspored za teren ${number} je uspešno obrisan.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};
