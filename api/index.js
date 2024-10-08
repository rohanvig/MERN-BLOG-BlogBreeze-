import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import paymentRoutes from './routes/payment.js';
import cors from 'cors';
import path from 'path';

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONT_END_URL, // Replace with your allowed origin
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));


// Set Cross-Origin-Opener-Policy header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use('/api/payment', paymentRoutes);


app.use((err, req, res, next) => {
  const statuscode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
