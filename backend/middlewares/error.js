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
      console.log("oject values");
      console.log(Object.values(err.errors));
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }
    console.log(error);
    res.status(error.statusCode).json({
      success: false,

      message: error.message || "internal serever error",
    });
  }
};
