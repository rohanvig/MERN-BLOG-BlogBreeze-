import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const verifyPayment = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    
    if (!user || !user.premiumSubscription) {
      return next(
        errorHandler(403, "failed")
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
