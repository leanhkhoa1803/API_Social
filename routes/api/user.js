const express = require("express");
const userController = require("../../controller/userController");
const router = express.Router();

router.patch("/:userId", userController.forgotPassword);

module.exports = router;
