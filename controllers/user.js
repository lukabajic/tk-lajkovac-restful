const User = require("../models/user");

const { throwError, catchError } = require("./utility/errors");
const { userData } = require("./utility/user");

exports.getUser = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    !user && throwError("Email ne postoji u našoj bazi.", 404);

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
    !user && throwError("Email ne postoji u našoj bazi.", 404);

    user.emailVerified = true;
    const result = await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Nalog je uspešno potvrdjen.",
      user: userData(result),
    });
  } catch (err) {
    catchError(res, err);
  }
};
