const express=require("express");
const { authRouter } = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const { resumeRouter } = require("./routes/resume.routes");



const app=express();


app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
].filter(Boolean);
app.use(cors({
    origin:allowedOrigins,
    credentials:true,
}))
app.use("/api/auth",authRouter);
app.use("/api/report",resumeRouter);

module.exports=app;
