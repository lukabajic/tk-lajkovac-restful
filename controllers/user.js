const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

const { catchError } = require('./utility/errors');
const { userData } = require('./utility/userData');
const db = require('./utility/db');
const { sendVerificationMail, passwordMail } = require('./utility/sendgrid');
const { getUserId } = require('./utility/jwt');
const getDates = require('./utility/getDates');

cloudinary.config({
  cloud_name: 'drqml7o5d',
  api_key: '773451592588417',
  api_secret: 'At8W2Ca3PZ1j0duzExw9j4mpqxI',
});

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

exports.getUser = async (req, res, next) => {
  const userId = req.query.userId || req.userId;

  try {
    const user = await db.getUser(userId);

    res.status(200).json({
      statusCode: 200,
      message: 'Korisnik je uspešno pronadjen.',
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
      message: 'List svih korisnika je pronađena.',
      users: users.map((user) => userData(user)),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.listUsers = async (req, res) => {
  const { limit = 10, offset = 0 } = req.params;

  try {
    const users = await db.listUsers({
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(201).json({
      statusCode: 201,
      message: 'List svih korisnika je pronađena.',
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

    user.emailVerified && res.render('verification-success', { already: true });

    user.emailVerified = true;

    await user.save();

    res.render('verification-success', { already: false });
  } catch (err) {
    catchError(res, err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await db.getUserByEmail(email);

    const pw = capitalize(Math.random().toString(36).slice(-8));
    const hashedPassword = await bcrypt.hash(pw, 12);

    user.password = hashedPassword;

    await passwordMail(email, pw);
    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: 'Šifra uspešno promenjena.',
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
      message: 'Email je uspešno poslat.',
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
      case 'SET_INITIAL_DATA':
        user.data.displayName = payload.displayName;
        user.data.phone = payload.phone;
        break;
      case 'UPDATE_EMAIL':
        user.email = payload.email;
        user.emailVerified = false;
        await sendVerificationMail(token, payload.email);
        break;
      case 'UPDATE_PASSWORD':
        const hashedPassword = await bcrypt.hash(payload.password, 12);
        user.password = hashedPassword;
        break;
      case 'UPDATE_NAME':
        user.data.displayName = payload.displayName;
        break;
      case 'UPDATE_PHONE':
        user.data.phone = payload.phone;
        break;
      case 'UPDATE_PICTURE':
        if (payload)
          cloudinary.api.delete_resources(payload, () => {
            console.log('[cloudinary] Old image deleted');
          });

        user.data.avatarName = req.file.filename;
        user.data.avatarUrl = req.file.path;
        break;
      default:
        break;
    }

    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: 'Podaci uspešno sačuvani.',
      user,
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
      message: 'Korisnik obrisan.',
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
      message: 'Korisnik sada ima premium prava.',
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.emptyUsersSchedule = async () => {
  try {
    const users = await db.getUsers();

    users.forEach(async (user) => {
      user.schedule = [];
      await user.save();
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Ispražnjen korisnički raspored.',
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.midnightUpdateUsers = async () => {
  try {
    const users = await db.getUsers();

    for (const u of users) {
      u.schedule = u.schedule.filter((s) => {
        const thisMonth = new Date().getMonth();
        const scheduleMonth = new Date(s.date).getMonth();
        return scheduleMonth >= thisMonth;
      });

      await u.save();
    }
    console.log('Users updated');
  } catch (err) {
    console.warn(err);
  }
};
