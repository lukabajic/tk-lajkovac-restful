const jwt = require("jsonwebtoken");

const generateToken = (userId, email) => {
  const token = jwt.sign({ email, userId }, "Dragan Milovanovic");
  return token;
};

module.exports = generateToken;
