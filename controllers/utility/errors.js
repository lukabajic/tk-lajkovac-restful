exports.catchError = (res, err) => {
  res.status(err.statusCode || 500).json({
    error: err.message || err.toString(),
    statusCode: err.statusCode || 500,
  });
};

exports.throwError = (msg, statusCode) => {
  error = new Error(msg);
  error.statusCode = statusCode;
  throw error;
};
