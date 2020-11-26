const { catchError, throwError } = require("../controllers/utility/errors");
const db = require("../controllers/utility/db");

module.exports = async (req, res, next) => {
  try {
    const user = await db.getUser(req.userId);

    !user.isAdmin && throwError("Samo admin ima dozvolu.", 403);

    next();
  } catch (err) {
    catchError(res, err);
  }
};
