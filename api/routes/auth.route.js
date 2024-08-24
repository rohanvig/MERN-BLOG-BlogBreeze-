import express from "express";
import {
  signup,
  signin,
  google,
  forgotPassword,
  resetPassword,
  verifyOtp, // Import the verifyOtp controller
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp); // Add the OTP verification route

export default router;
