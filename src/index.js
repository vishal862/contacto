import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGO_URl)
  .then(() => {
    console.log("mongodb connected!");
  })
  .catch((error) => {
    console.log("failed to connect");
  });

app.listen(3500, () => {
  console.log("app is listening on port 3500");
});
