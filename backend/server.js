import "dotenv/config";

import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcrypt';


const app = express();

app.use(cors());

app.use(express.static("uploads"));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const start = async () => {
  const mongoDB = await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected...');

  app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
  });
};
start();



//user routes
import userRouter from "./routes/user.routes.js";
app.use("/user", userRouter);


//posts routes
import postsRouter from "./routes/posts.routes.js";
app.use("/post", postsRouter);