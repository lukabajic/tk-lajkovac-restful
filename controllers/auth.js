const bcrypt = require("bcryptjs");

const User = require("../models/user");

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

    // success response
    res.status(201).json({
      status: 201,
      message: "Korisnik je uspešno kreiran.",
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
  } catch (err) {
    // error handling
    res.json({
      error: err.message || err.toString(),
      status: err.statusCode || 500,
    });
  }
};
