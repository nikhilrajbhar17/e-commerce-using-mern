const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV == "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  } else {
    let error = { ...err };
    err.message = err.message;
    if (err.name === "CasteError") {
      const message = `resource not found . Invalid ${err.path}`;
      error = new ErrorHandler(message, 400);
    }
    if (err.name == "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.map);
      error = new ErrorHandler(message, 400);
    }
    res.status(error.statusCode).json({
      success: false,

      messge: error.message || "internal serever error",
    });
  }
};
