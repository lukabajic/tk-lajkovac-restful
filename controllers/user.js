const User = require("../models/user");

const { throwError, catchError } = require("./utility/errors");
const { userData } = require("./utility/user");
const sendMail = require("./utility/verify");

exports.getUser = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    !user && throwError("Korisnik ne postoji u našoj bazi.", 404);

    res.status(201).json({
      statusCode: 201,
      message: "Korisnik je uspešno pronadjen.",
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.verifyUser = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    !user && throwError("Korisnink ne postoji u našoj bazi.", 404);

    user.emailVerified && throwError("Nalog je već potvrđen.", 400);

    user.emailVerified = true;
    const result = await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Nalog je uspešno potvrđen.",
      user: userData(result),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  const { token, email } = req;
  try {
    await sendMail(token, email);
    res.status(200).json({
      statusCode: 200,
      message: "Email je uspešno poslat.",
    });
  } catch (err) {
    catchError(res, err);
  }
};
