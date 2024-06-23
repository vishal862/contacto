import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes.js"

dotenv.config();

const app = express();
app.use(express.json())

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

app.use("/api/auth",authRoute);

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})