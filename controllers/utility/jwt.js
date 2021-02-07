const jwt = require("jsonwebtoken");

exports.generateToken = (userId, email) => {
  const token = jwt.sign({ email, userId }, "Dragan Milovanovic");
  return token;
};

exports.getUserId = (token) => {
  const decodedToken = jwt.verify(token, "Dragan Milovanovic");
  return decodedToken.userId;
};
