import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP } from "../utils/twilio.js"; // Import from your utils directory
import { sendEmail } from "../utils/mailer.js";


export const signup = async (req, res, next) => {
  const { username, email, password, phoneNumber, recaptchaToken } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || !phoneNumber || !recaptchaToken) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Validate username
  if (username.length < 5 || username.length > 20) {
    return next(
      errorHandler(400, "Username must be between 5 and 20 characters")
    );
  }
  if (!/^[a-z0-9]+$/.test(username)) {
    return next(
      errorHandler(
        400,
        "Username must be in lowercase and contain only alphanumeric characters"
      )
    );
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
      errorHandler(400, "Username must contain only alphanumeric characters")
    );
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, "User already exists"));
    }

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

    // Send welcome email to new users
    const subject = "🎉 Welcome to BlogBreeze!";
    const text = `Dear ${username},

Welcome to BlogBreeze! We're excited to have you as part of our community. Here's a quick overview of your account details:

- Email: ${email}
- Password: ${password}

Now that you're here, you can start exploring and sharing your thoughts with the world. Whether you're here to read, write, or connect with like-minded individuals, BlogBreeze is the perfect place to express yourself.

If you have any questions or need assistance, don't hesitate to reach out to our support team.

We're thrilled to have you on board, ${username}. Let's create something amazing together!

Best regards,
The BlogBreeze Team
`;

    try {
      await sendEmail(email, subject, text);
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }

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

      // Optionally log or handle the existing user case
      console.log("Existing user signed in");
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

      // Send welcome email to new users
      const subject = "🎉 Welcome to BlogBreeze!";
      const text = `Dear ${name},

Welcome to BlogBreeze! We're excited to have you as part of our community. Here's a quick overview of your account details:

- Email: ${email}
- Password: ${generatedPassword} // Use the generated password

Now that you're here, you can start exploring, writing, and sharing your thoughts with the world. Whether you're here to read, write, or connect with like-minded individuals, BlogBreeze is the perfect place to express yourself.

If you have any questions or need assistance, don't hesitate to reach out to our support team.

We're thrilled to have you on board, ${name}. Let's create something amazing together!

Best regards,
The BlogBreeze Team
`;

      try {
        await sendEmail(email, subject, text);
        console.log("Welcome email sent successfully");
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }
    }
  } catch (error) {
    next(error);
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

  const resetLink = `${process.env.FRONT_END_URL}/reset_password/${user._id}/${token}`;

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
