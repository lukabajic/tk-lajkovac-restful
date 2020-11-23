const User = require("../models/user");

const { throwError, catchError } = require("./utility/errors");
const { userData } = require("./utility/userData");
const { sendVerificationMail } = require("./utility/sendgrid");

exports.getUser = async (req, res, next) => {
  const userId = req.body.userId || req.userId;

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

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select(
      "-password -emailVerified -isAdmin -__v -avatarUrl -data.isPremium"
    );
    !users &&
      throwError("Došlo je do greške prilikom pretrage korisnika.", 404);

    res.status(201).json({
      statusCode: 201,
      message: "List svih korisnika je pronađena.",
      users: users.map((user) => userData(user)),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.verifyUserEmail = async (req, res, next) => {
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    !user && throwError("Korisnink ne postoji u našoj bazi.", 404);

    user.emailVerified && throwError("Nalog je već potvrđen.", 400);

    user.emailVerified = true;

    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Nalog je uspešno potvrđen.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.resendVerificationEmail = async (req, res, next) => {
  const { token, email } = req;
  try {
    await sendVerificationMail(token, email);
    res.status(200).json({
      statusCode: 200,
      message: "Email je uspešno poslat.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.updateUserData = async (req, res, next) => {
  const { displayName, phone } = req.body;
  const { userId } = req;

  try {
    const user = await User.findById(userId);
    !user && throwError("Korisnink ne postoji u našoj bazi.", 404);

    user.data.displayName = displayName;
    user.data.phone = phone;

    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Podaci su sačuvani.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

// exports.midnightUpdateUser = async () => {
//   const users = await User.find();
//   !users && throwError("Nismo pronašli korisnike u našoj bazi.", 404);

//   users.forEach(async (user) => {
//     user.scheduled = {
//       0: user.scheduled[1],
//       1: user.scheduled[2],
//       2: null,
//     };
//     await user.save();
//   });
// };
