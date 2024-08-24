// twilioService.js
import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config()


// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

if (!accountSid || !authToken) {
  throw new Error("Twilio credentials are not defined in the environment variables");
}

// Function to send OTP via SMS
export const sendOTP = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your BlogBreeze OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    throw new Error("Failed to send OTP via Twilio");
  }
};

// Function to generate OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};
