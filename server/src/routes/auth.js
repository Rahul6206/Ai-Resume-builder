const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/user/register", authController.registerUser);
router.post("/user/login", authController.loginUser);
router.post("/user/logout", authController.logoutUser);
router.post("/user/verify", authController.verifyUser);
router.post("/user/sendOtp", authController.sendOtp);
router.post("/user/forgot-password", authController.forgotPassword);
router.post("/user/reset-password", authController.resetPassword);
router.post("/user/refresh", authController.refreshToken);
router.get("/user/me", verifyToken, authController.getCurrentUser);
router.get("/user/csrf-token", authController.getCsrfToken);

module.exports = router;
