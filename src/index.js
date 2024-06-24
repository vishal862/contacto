import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.routes.js"
import contactRoute from "./routes/contact.routes.js"
import testRoute from "./routes/test.routes.js"
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser());

try {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("mongodb connected!");
    })
    .catch((error) => {
      console.log(error,"failed to connect");
    });
} catch (error) {
  console.log(error);
}

app.listen(3500, () => {
  console.log("app is listening on port 3500");
});

app.use("/api/",testRoute)
app.use("/api/auth",authRoute);
app.use("/api/contact",contactRoute)

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})