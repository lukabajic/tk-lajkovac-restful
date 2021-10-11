const bcrypt = require('bcryptjs');

const User = require('../models/user');

const { generateToken } = require('./utility/jwt');
const { sendVerificationMail } = require('./utility/sendgrid');
const { userData } = require('./utility/userData');
const db = require('./utility/db');
const { catchError } = require('./utility/errors');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    await db.userExists(email);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPassword });
    const result = await user.save();

    const token = generateToken(result._id, result.email);

    await sendVerificationMail(token, email);

    res.status(201).json({
      statusCode: 201,
      token,
      expiresIn: 14 * 24 * 60 * 60 * 1000,
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.getUserByEmail(email);

    await db.passwordMatches(password, user.password);

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      statusCode: 200,
      token,
      expiresIn: 14 * 24 * 60 * 60 * 1000,
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};
