const ErrorResponse = require("../model/ErrorResponse");

const errorMiddleware = (err, req, res, next) => {
  let errors = { ...err };
  if (err.message) {
    errors.code = 500;
    errors.message = err.message;
  }
  //Duplicate
  if (err.code == 11000) {
    errors = new ErrorResponse(400, err.keyValue);
    for (i in errors.message) {
      errors.message[i] = `${i} is already exist`;
    }
  }

  //Mongo validator
  if (err.name === "ValidationError") {
    errors = new ErrorResponse(400, err.errors);
    for (i in err.errors) {
      errors.message[i] = errors.message[i].message;
    }
  }
  res.status(errors.code || 500).json({
    success: false,
    code: errors.code || 500,
    message: errors.message || "Server error",
  });
  next();
};

module.exports = errorMiddleware;
