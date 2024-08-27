import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP } from "../utils/twilio.js"; // Import from your utils directory
import { sendEmail } from "../utils/mailer.js";
import axios from "axios"

export const signup = async (req, res, next) => {
  const { username, email, password, phoneNumber, recaptchaToken } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || !phoneNumber || !recaptchaToken) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // Verify the CAPTCHA
    const captchaResponse = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: "6LfKHy8qAAAAAFbB9yb3OHWdUgo9NbiIm-HKMmC1", // Replace with your reCAPTCHA secret key
          response: recaptchaToken, // Pass the token received from frontend
        },
      }
    );

    const { success } = captchaResponse.data;

    if (!success) {
      return next(errorHandler(400, "CAPTCHA verification failed."));
    }
  } catch (error) {
    return next(errorHandler(500, "Error verifying CAPTCHA."));
  }

  // Ensure password meets minimum length requirement
  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  // Validate password with a regex to ensure it contains uppercase, lowercase, digit, and special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!password.match(passwordRegex)) {
    return next(
      errorHandler(
        400,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
    );
  }

  // Validate username (e.g., only alphanumeric characters)
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  if (!username.match(usernameRegex)) {
    return next(
      errorHandler(
        400,
        "Username must contain only alphanumeric characters"
      )
    );
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      verified: false, // Set to false initially until OTP verification
    });

    await newUser.save();

    // Generate OTP
    const otp = generateOTP();

    // Send OTP via SMS (Twilio)
    await sendOTP(phoneNumber, otp);

    // Save OTP and set expiration (5 minutes)
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 5 * 60 * 1000;
    await newUser.save();

    // Optionally, send a welcome email (Nodemailer)
    // await sendEmail(email, "Welcome to BlogBreeze", "Your welcome message here");

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent for verification.",
    });
  } catch (err) {
    next(err);
  }
};

// Signin function to authenticate a user
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    // Find user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.SECRET_KEY
    );

    // Exclude the password from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send the token in a cookie and return the user details
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error); // Handle any errors that occur during signin
  }
};

// Google Signin function to authenticate or create a user using Google OAuth
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      // User exists, generate a JWT token
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      // User doesn't exist, create a new user with a generated password
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const subject = "Welcome to BlogBreeze!";
      const text = `Hello ${name},\n\nWelcome to BlogBreeze! We're thrilled to have you on board. Start exploring and sharing your thoughts.\n\nBest regards,\nBlogBreeze Team`;

      try {
        await sendEmail(email, subject, text);
        console.log("Welcome email sent successfully");
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }

      // Generate a JWT token for the new user
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.SECRET_KEY
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    }
  } catch (error) {
    next(error); // Handle any errors that occur during Google sign-in
  }
};

// Function to handle forgot password requests

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(errorHandler(404, "User not found"));
  }

  // Create JWT token for password reset
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  const resetLink = `http://localhost:5173/reset_password/${user._id}/${token}`;

  try {
    await sendEmail(email, "Reset your password", resetLink);
    res.send({ status: "success", message: "Password reset link sent!" });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Email could not be sent"));
  }
};

// Function to handle resetting the user's password
// Adjust the path as necessary

export const resetPassword = async (req, res) => {
  const { userId, token, password } = req.body; // Ensure password is sent in the body

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!password || !password.match(passwordRegex)) {
    return res.status(400).json({
      status: "fail",
      message:
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }

  try {
    // Verify the token to ensure it's valid and matches the user ID
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.id !== userId) {
      return res.status(400).json({ status: "fail", message: "Invalid token" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error); // Log the exact error
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(400, "User not found"));
    }

    if (user.otp !== otp) {
      return next(errorHandler(400, "Invalid OTP"));
    }

    if (user.otpExpires < Date.now()) {
      return next(errorHandler(400, "OTP expired"));
    }

    user.isVerified = true;
    user.otp = null; // Clear the OTP
    user.otpExpires = null; // Clear the OTP expiration

    await user.save();

    res.json({ message: "Account verified successfully!" });
  } catch (error) {
    next(error);
  }
};
