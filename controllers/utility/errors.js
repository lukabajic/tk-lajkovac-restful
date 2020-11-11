exports.catchError = (res, err) => {
  res.json({
    error: err.message || err.toString(),
    status: err.statusCode || 500,
  });
};

exports.throwError = (msg, statusCode) => {
  error = new Error(msg);
  error.statusCode = statusCode;
  throw error;
};
