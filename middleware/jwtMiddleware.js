const User = require("../database/models/User");
const ErrorResponse = require("../model/ErrorResponse");
const JWT = require("jsonwebtoken");
const SuccessResponse = require("../model/SuccessResponse");
const { asyncMiddleware } = require("./asyncMiddleware");

const jwtAuth = async (req, res, next) => {
  let token = await req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(new ErrorResponse(404, "token is not found"));
  }
  try {
    const payload = JWT.verify(token, process.env.secretKey_access_token);
    const user = await User.findOne({ name: payload.name });
    if (user) {
      req.user = payload;
      next();
    }
  } catch (error) {
    return next(new ErrorResponse(403, "token is not match"));
  }
};

//refreshToken
const refreshToken = asyncMiddleware(async (req, res, next) => {
  let { refreshToken } = req.body;
  if (!refreshToken) {
    return next(new ErrorResponse(404, "token is not found"));
  }
  let decoded_payload = JWT.decode(refreshToken, { complete: true });
  //console.log(decoded_payload.payload);

  JWT.verify(
    refreshToken,
    process.env.secretKey_refresh_token,
    async (err, decode) => {
      if (err) {
        //neu refresh token hop le nhung het thoi gian song
        if (err.message === "jwt expired") {
          //tao accessToken
          const accessToken = JWT.sign(
            {
              name: decoded_payload.payload.name,
              email: decoded_payload.payload.email,
            },
            process.env.secretKey_access_token,
            {
              algorithm: "HS256",
              expiresIn: "1 hour",
            }
          );

          //tao refreshToken
          const refreshTokenNew = JWT.sign(
            {
              name: decoded_payload.payload.name,
              email: decoded_payload.payload.email,
            },
            process.env.secretKey_refresh_token,
            {
              algorithm: "HS256",
              expiresIn: "1000 second",
            }
          );

          //update refreshToken
          await User.findOneAndUpdate(
            { email: decoded_payload.payload.email },
            { refreshToken: refreshTokenNew }
          );
          //tra ve accessToken moi va refreshToken moi
          return res.json({ accessToken, refreshTokenNew });
        }

        //loi con lai
        return next(new ErrorResponse(500, "token is invalid"));
      } else {
        //neu refreshToken hop le va con thoi gian song
        const accessToken = JWT.sign(
          {
            name: decoded_payload.payload.name,
            email: decoded_payload.payload.email,
          },
          process.env.secretKey_access_token,
          {
            algorithm: "HS256",
            expiresIn: "1 hour",
          }
        );

        //tra ve accessToken moi
        return res.json({ accessToken });
      }
    }
  );
});
module.exports = {
  jwtAuth: jwtAuth,
  refreshToken: refreshToken,
};
