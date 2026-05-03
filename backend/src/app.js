const express=require("express");
const { authRouter } = require("./routes/auth.routes");
const cookieParser = require("cookie-parser");
const cors=require("cors");
const { resumeRouter } = require("./routes/resume.routes");



const app=express();


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}))

app.get("/", (req, res) => {
    res.status(200).json({
        message: "RoleFit-AI backend is running",
    });
});

app.use("/api/auth",authRouter);
app.use("/api/report",resumeRouter);

module.exports=app;
