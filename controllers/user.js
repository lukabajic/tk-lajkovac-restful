const bcrypt = require("bcryptjs");

const { throwError, catchError } = require("./utility/errors");
const { userData } = require("./utility/userData");
const db = require("./utility/db");
const { sendVerificationMail } = require("./utility/sendgrid");
const { getUserId } = require("./utility/jwt");

exports.getUser = async (req, res, next) => {
  const userId = req.query.userId || req.userId;

  try {
    const user = await db.getUser(userId);

    res.status(200).json({
      statusCode: 200,
      message: "Korisnik je uspešno pronadjen.",
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await db.getUsers();

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
  const { token } = req.params;
  const userId = getUserId(token);

  try {
    const user = await db.getUser(userId);

    res.render("verification-success", { already: true });

    user.emailVerified = true;

    await user.save();

    res.render("verification-success", { already: false });
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
  const { action, payload } = req.body;
  const { userId, token } = req;

  try {
    const user = await db.getUser(userId);

    switch (action) {
      case "SET_INITIAL_DATA":
        user.data.displayName = payload.displayName;
        user.data.phone = payload.phone;
        break;
      case "UPDATE_EMAIL":
        user.email = payload.email;
        user.emailVerified = false;
        await sendVerificationMail(token, payload.email);
        break;
      case "UPDATE_PASSWORD":
        await db.passwordMatches(payload.password, payload.oldPassword);
        const hashedPassword = await bcrypt.hash(payload.password, 12);
        user.password = hashedPassword;
        break;
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

exports.deleteUser = async (req, res, next) => {
  const { password } = req.body;
  const { userId } = req;

  try {
    const user = await db.getUser(userId);

    await db.passwordMatches(password, user.password);

    await user.remove();

    res.status(200).json({
      statusCode: 200,
      message: "Korisnik obrisan.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.giveUserPremiumPermissions = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const user = await db.getUser(userId);

    user.data.isPremium = true;

    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Korisnik sada ima premium prava.",
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.cancelUserMatch = async (req, res, next) => {};

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
