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

app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));

app.use("/api/v1/media", mediaroute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", perchaseroute);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server listen at port ${port}`);
});