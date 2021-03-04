const User = require("../database/models/User");
const { asyncMiddleware } = require("../Middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");

exports.forgotPassword = asyncMiddleware(async (req, res, next) => {
  const { userId } = req.params; //lay id user
  const { password, newpassword } = req.body;
  if (!userId.trim()) {
    return next(new ErrorResponse(400, "userId is empty"));
  }
  const doc = await User.findById(userId);
  if (!doc) {
    return next(new ErrorResponse(404, "user is not exist"));
  }
  //kiem tra password co dung ko
  const isMatchPassword = await User.comparePassword(password, doc.password);
  if (isMatchPassword) {
    doc.password = newpassword;
    const result = await doc.save();
    if (!result) {
      return next(new ErrorResponse(400, "Error"));
    }
    res.status(200).json(new SuccessResponse(200, result));
  } else {
    return next(new ErrorResponse(400, "Password is incorrect"));
  }
});
