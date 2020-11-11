const bcrypt = require("bcryptjs");
const sendgrid = require("@sendgrid/mail");

const User = require("../models/user");

const generateToken = require("./utility/jwt");
const message = require("./utility/verify");
const { userData } = require("./utility/user");
const { catchError, throwError } = require("./utility/errors");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const check = await User.findOne({ email });
    check && throwError("Email se je već u upotrebi.", 409);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ email, password: hashedPassword });
    const result = await user.save();

    const token = generateToken(result._id, result.email);

    sendgrid
      .send(message(result._id, email))
      .then(() => {
        res.status(201).json({
          statusCode: 201,
          message: "Korisnik je uspešno kreiran.",
          token,
          expiresIn: 14 * 24 * 60 * 60 * 1000,
          user: userData(result),
        });
      })
      .catch(() => throwError("Greška pri slanju verifikacionog koda.", 502));
  } catch (err) {
    catchError(res, err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    !user && throwError("Email ne postoji u našoj bazi.", 404);

    const passwordsMatch = await bcrypt.compare(password, user.password);
    !passwordsMatch && throwError("Uneli ste pogrešnu lozinku.", 401);

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      statusCode: 200,
      message: "Uspešno ste se ulogovali.",
      token,
      expiresIn: 14 * 24 * 60 * 60 * 1000,
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};
