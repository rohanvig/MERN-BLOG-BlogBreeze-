import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cors from 'cors';

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies to be sent and received
}));

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

//Middleware for error handling

app.use((err, req, res, next) => {
  const statuscode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

