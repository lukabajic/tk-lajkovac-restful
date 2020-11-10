const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendgrid = require("@sendgrid/mail");

const User = require("../models/user");

const html = require("./utility/mailTemplate");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res, next) => {
  // extract email and password from request
  const { email, password } = req.body;

  try {
    // check to see if email is already used
    const check = await User.findOne({ email });
    if (check) {
      error = new Error("Email se je već u upotrebi.");
      error.statusCode = 409;
      throw error;
    }

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create and store the user
    const user = new User({ email, password: hashedPassword });
    const result = await user.save();

    // create the token
    const token = jwt.sign(
      {
        email: result.email,
        userId: result._id,
      },
      "Dragan Milovanovic",
      { expiresIn: "14d" }
    );

    // verification email config
    const message = {
      to: email,
      from: "me@lukabajic.dev",
      subject: "Potvrda email adrese",
      html: html(result._id),
    };
    // verification email send
    sendgrid
      .send(message)
      .then(() => {
        // success response
        res.status(201).json({
          status: 201,
          message: "Korisnik je uspešno kreiran.",
          token,
          expiresIn: 14 * 24 * 60 * 60, // token expiration
          user: {
            userId: result._id,
            email: result.email,
            emailVerified: result.emailVerified,
            isAdmin: result.isAdmin,
            displayName: result.displayName,
            avatarUrl: result.avatarUrl,
            phone: result.phone,
          },
        });
      })
      .catch(() => {
        error = new Error("Greška pri slanju verifikacionog koda.");
        error.statusCode = 502;
        throw error;
      });
  } catch (err) {
    // error handling
    res.json({
      error: err.message || err.toString(),
      status: err.statusCode || 500,
    });
  }
};
