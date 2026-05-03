const express=require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/file.middleware");
const {resumeConroller,getReportById, getAllReports, getReportPDF} = require("../controllers/resume.controllers");

const resumeRouter = express.Router();

resumeRouter.post("/",authMiddleware,upload.single("resume"),resumeConroller);

resumeRouter.get("/interview/:interviewId",authMiddleware,getReportById);
resumeRouter.get("/allreports",authMiddleware,getAllReports);
resumeRouter.post("/pdf/:reportId",authMiddleware,getReportPDF);


module.exports={resumeRouter};