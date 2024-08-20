import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Signup function to create a new user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  // Ensure password meets minimum length requirement
  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  // Validate password with a regex to ensure it contains uppercase, lowercase, digit, and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (!password.match(passwordRegex)) {
    return next(
      errorHandler(400, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
    );
  }

  // Validate username for length, spaces, case, and allowed characters
  if (username) {
    if (username.length < 5 || username.length > 20) {
      return next(errorHandler(400, "Username must be between 7 and 20 characters"));
    }
    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, "Username must be in lowercase"));
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, "Username can only contain letters and numbers"));
    }
  }

  // Hash the password before saving the user
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create a new user instance
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    // Save the user to the database
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error); // Handle any errors that occur during save
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
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.SECRET_KEY);

    // Exclude the password from the response
    const { password: pass, ...rest } = validUser._doc;

    // Send the token in a cookie and return the user details
    res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
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
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY);
      const { password, ...rest } = user._doc;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
    } else {
      // User doesn't exist, create a new user with a generated password
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      // Generate a JWT token for the new user
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.SECRET_KEY);
      const { password, ...rest } = newUser._doc;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
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
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "1h" });

  // Setup nodemailer transporter
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Use environment variables for Gmail credentials
      pass: process.env.GMAIL_PASS,
    },
  });

  // Setup email options for password reset
  var mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Reset your password",
    text: `http://localhost:5173/reset_password/${user._id}/${token}`, // Link to the frontend password reset page
  };

  // Send the password reset email
  try {
    await transporter.sendMail(mailOptions);
    res.send({ status: "success", message: "Password reset link sent!" });
  } catch (error) {
    console.error(error); // Log the error if email sending fails
    next(errorHandler(500, "Email could not be sent"));
  }
};

// Function to handle resetting the user's password
export const resetPassword = async (req, res) => {
  const { userId, token, password } = req.body; // Ensure password is sent in the body

  try {
    // Verify the token to ensure it's valid and matches the user ID
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.id !== userId) {
      return res.status(400).json({ status: "fail", message: "Invalid token" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: "success", message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error); // Log the exact error
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
