const express=require("express");
const { authRouter } = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const { resumeRouter } = require("./routes/resume.routes");



const app=express();

app.get("/",(req,res)=>{
    res.send("Backend is running! ");
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use("/api/auth",authRouter);
app.use("/api/report",resumeRouter);

module.exports=app;
