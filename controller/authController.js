const User = require("../database/models/User");
const { asyncMiddleware } = require("../Middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");
const uuid = require("uuid");
const sendMail = require("../model/mailer");
const { transMail, transSuccess, transErrors } = require("../lang/vi");
const JWT = require("jsonwebtoken");

//register
exports.register = asyncMiddleware(async (req, res, next) => {
  let { name, email, password } = req.body;
  const host = req.get("host");
  const userEmail = await User.findByEmail(email);
  if (userEmail) {
    if (userEmail.deletedAt != null) {
      return next(new ErrorResponse(500, "The account has been deleted"));
    }
    if (!userEmail.isActive) {
      return next(
        new ErrorResponse(500, "Account not activated please check mail")
      );
    }
    return next(new ErrorResponse(500, "Email is already"));
  }
  const user = new User({ name, email, password, verifyToken: uuid.v4() });
  const result = await user.save();
  const linkVerify = `${req.protocol}://${host}/api/v1/auth/verify/${user.verifyToken}`;
  sendMail(email, transMail.subject, transMail.templates(linkVerify))
    .then(() => {
      res.json(new SuccessResponse(200, transSuccess.useCreatedSuccess));
    })
    .catch(async (err) => {
      //remove user
      await result.removeById(user._id);
      return next(new ErrorResponse(500, transErrors.error_server));
    });
});

//active account
exports.verifyAccount = asyncMiddleware(async (req, res, next) => {
  const token = req.params.token;
  const checkToken = await User.findOne({ verifyToken: token });
  if (!checkToken) {
    return next(new ErrorResponse(500, transMail.token_isActived));
  }
  await User.findOneAndUpdate(
    { verifyToken: token },
    { isActive: true, verifyToken: null }
  );
  res.json(new SuccessResponse(200, transSuccess.account_isActived));
});

//login
exports.login = asyncMiddleware(async (req, res, next) => {
  let { email, password } = req.body;

  //kiem tra email co ton tai
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(404, "Email is not exists"));
  } else {
    //kiem tra password hop le
    const isMatchPassword = await User.comparePassword(password, user.password);
    if (isMatchPassword) {
      let payload = {
        name: user.name,
        email: user.email,
      };
      //tao accessToken
      const accessToken = JWT.sign(
        payload,
        process.env.secretKey_access_token,
        {
          algorithm: "HS256",
          expiresIn: "1 hour",
        }
      );
      //tao refreshToken
      const refreshToken = JWT.sign(
        payload,
        process.env.secretKey_refresh_token,
        {
          algorithm: "HS256",
          expiresIn: "7 days",
        }
      );
      res.setHeader("Authorization", accessToken);

      //tra ve cho  client accessToken va refreshToken
      res.json({ accessToken, refreshToken });

      //luu refreshToken vao DB
      await User.findOneAndUpdate(
        { email: email },
        { refreshToken: refreshToken }
      );
    } else {
      return next(new ErrorResponse(403, "Password is not match"));
    }
  }
});
