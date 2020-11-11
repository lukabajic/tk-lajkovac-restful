const bcrypt = require("bcryptjs");
const sendgrid = require("@sendgrid/mail");

const User = require("../models/user");

const generateToken = require("./utility/jwt");
const message = require("./utility/verify");
const userData = require("./utility/userData");
const { catchError, throwError } = require("./utility/errors");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res, next) => {
  // extract email and password from request
  const { email, password } = req.body;

  try {
    // check to see if email is already used
    const check = await User.findOne({ email });
    check && throwError("Email se je već u upotrebi.", 409);

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create and store the user
    const user = new User({ email, password: hashedPassword });
    const result = await user.save();

    // create the token
    const token = generateToken(result._id, result.email);

    // verification email send
    sendgrid
      .send(message(userId, email))
      .then(() => {
        // success response
        res.status(201).json({
          statusCode: 201,
          message: "Korisnik je uspešno kreiran.",
          token,
          expiresIn: 14 * 24 * 60 * 60, // token expiration
          user: userData(result),
        });
      })
      .catch(() => throwError("Greška pri slanju verifikacionog koda.", 502));
  } catch (err) {
    // error handling
    catchError(res, err);
  }
};

exports.login = async (req, res, next) => {
  // extract email and password from request
  const { email, password } = req.body;

  try {
    // look for a user with the entered email
    const user = await User.findOne({ email });
    !user && throwError("Email ne postoji u našoj bazi.", 401);

    // check if the passwords match
    const passwordsMatch = await bcrypt.compare(password, user.password);
    !passwordsMatch && throwError("Uneli ste pogrešnu lozinku.", 401);

    // create the token
    const token = generateToken(user._id, user.email);

    // success response
    res.status(200).json({
      statusCode: 200,
      message: "Uspešno ste se ulogovali.",
      token,
      expiresIn: 14 * 24 * 60 * 60, // token expiration
      user: userData(user),
    });
  } catch (err) {
    catchError(res, err);
  }
};
