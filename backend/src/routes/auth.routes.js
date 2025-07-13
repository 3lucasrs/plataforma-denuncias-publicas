const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth.controller");
const { validateToken } = require("../middleware/auth.middleware");

router.post("/register", auth_controller.register);
router.post("/login", auth_controller.login);
router.get("/verifytoken", validateToken, auth_controller.verifyToken);
router.post("/forgot-password", auth_controller.forgotPassword);
router.post("/reset-password", auth_controller.resetPassword);

module.exports = router;
