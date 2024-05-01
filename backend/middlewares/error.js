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
  }
  if ((process.env.NODE_ENV = "PRODUCTION")) {
    let error = { ...err };
    err.message = err.message;
    if (err.name === "CastError") {
      const message = `resource not found . Invalid ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }
    if (err.code == 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // handling wrong jst token
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web token is invalid ..Try again";
      error = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web token is expired ..Try again";
      error = new ErrorHandler(message, 400);
    }
    console.log(error);
    res.status(error.statusCode).json({
      success: false,

      message: error.message || "internal serever error",
    });
  }
};
