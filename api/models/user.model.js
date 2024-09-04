import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      default: "Not Provided",
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null, // Optional field
    },
    otpExpires: {
      type: Date,
      default: null, // Optional field
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    premiumSubscription: {
      type: Boolean,
      default: false, // Default value for subscription status
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
