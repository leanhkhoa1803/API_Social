const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const JWT = require("jsonwebtoken");

exports.checkLogout = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  JWT.destroy(token);
  console.log(token);
  next();
};
