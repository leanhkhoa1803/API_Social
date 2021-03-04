const express = require("express");
const router = express.Router();
const authControllers = require("../../controller/authController");
const { refreshToken } = require("../../middleware/jwtMiddleware");
const { checkLogin } = require("../../middleware/checkLogin");
const { checkLogout } = require("../../middleware/checkLogout");
const { baseAuth } = require("../../middleware/baseAuth");

router.post("/register", baseAuth, authControllers.register);
router.post("/login", baseAuth, authControllers.login);
router.get("/verify/:token", authControllers.verifyAccount);
router.post("/refreshToken", baseAuth, refreshToken);
router.post("/logout", checkLogout);

module.exports = router;
