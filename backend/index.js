import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaroute from "./routes/mediaroute.js";
import perchaseroute from "./routes/Purchaseroute.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// API routes
app.use("/api/v1/media", mediaroute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", perchaseroute);


export default app;
