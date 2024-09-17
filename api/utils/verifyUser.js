import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Ensure you have cookie-parser middleware enabled in your server
export const verifyToken = (req, res, next) => {
  // Get the token from the cookies
  const token = req.cookies?.access_token; // Adjusted to 'access_token'

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, token is missing" });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized, token invalid"));
    }
    req.user = user;
    next();
  });
};
