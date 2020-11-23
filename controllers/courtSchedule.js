const CourtSchedule = require("../models/courtSchedule");

const { throwError, catchError } = require("./utility/errors");

exports.createCourtSchedule = async (req, res, next) => {
  const { courtScheduleTimes, courtScheduleNumber } = req.body;

  try {
    const check = await CourtSchedule.findOne({ number: courtScheduleNumber });
    check && throwError("Teren već ima raspored termina.", 400);

    const courtSchedule = await new CourtSchedule({
      number: courtScheduleNumber,
      times: courtScheduleTimes,
    }).save();
    !courtSchedule &&
      throwError(
        "Greška pri pokušaju da se sačuva raspored termina za teren u bazi.",
        400
      );

    res.status(200).json({
      statusCode: 200,
      message: `Novi raspored za teren ${courtScheduleNumber} je uspešno napravljen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getCourtSchedule = async (req, res, next) => {
  const { courtScheduleNumber } = req.body;

  try {
    const courtSchedule = await CourtSchedule.findOne({
      number: courtScheduleNumber,
    });
    !courtSchedule &&
      throwError(`Teren broj ${courtScheduleNumber} ne postoji.`, 400);

    res.status(200).json({
      statusCode: 200,
      courtSchedule: courtSchedule,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.editCourtSchedule = async (req, res, next) => {
  const { courtScheduleTimes, courtScheduleNumber } = req.body;

  try {
    const courtSchedule = await CourtSchedule.findOne({
      number: courtScheduleNumber,
    });
    !courtSchedule &&
      throwError(`Teren broj ${courtScheduleNumber} ne postoji.`, 400);

    courtSchedule.times = courtScheduleTimes;
    const updatedCourtSchedule = await courtSchedule.save();
    !updatedCourtSchedule &&
      throwError(
        "Greška pri pokušaju da se sačuva raspored za teren u bazi.",
        400
      );

    res.status(200).json({
      statusCode: 200,
      message: `Raspored za teren ${courtScheduleNumber} je uspešno promenjen.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.deleteCourtSchedule = async (req, res, next) => {
  const { courtScheduleNumber } = req.body;

  try {
    const courtSchedule = await CourtSchedule.deleteOne({
      number: courtScheduleNumber,
    });
    !courtSchedule &&
      throwError(`Teren broj ${courtScheduleNumber} ne postoji.`, 400);

    res.status(200).json({
      statusCode: 200,
      message: `Raspored za teren ${courtScheduleNumber} je uspešno obrisan.`,
    });
  } catch (err) {
    catchError(res, err);
  }
};
