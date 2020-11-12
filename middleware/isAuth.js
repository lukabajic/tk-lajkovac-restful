const jwt = require("jsonwebtoken");

const { catchError, throwError } = require("../controllers/utility/errors");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    !authHeader &&
      throwError("Niste ulogovani ili nemate pravo pristupa.", 401);

    const token = authHeader.split(" ")[1];
    !token && throwError("Niste ulogovani ili nemate pravo pristupa.", 401);

    const decodedToken = jwt.verify(token, "Dragan Milovanovic");

    req.userId = decodedToken.userId;
    req.email = decodedToken.email;

    next();
  } catch (err) {
    catchError(res, err);
  }
};
