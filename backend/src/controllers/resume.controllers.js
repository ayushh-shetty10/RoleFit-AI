const { PDFParse } = require("pdf-parse");
const { GenerateReport, GeneratePDF } = require("../services/ai.service");
const { ResumeReportModel } = require("../models/ResumeReport.model");

/**
 * @route POST/api/report/
 * @description generate a report by taking input from the user
 * @access PRIVATE
 */
const parseIfString = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
};

const normalizeReport = (report) => ({
    ...report,
    technicalQNAs: Array.isArray(report.technicalQNAs)
        ? report.technicalQNAs.map(parseIfString)
        : report.technicalQNAs,
    behaviouralQNAs: Array.isArray(report.behaviouralQNAs)
        ? report.behaviouralQNAs.map(parseIfString)

        : report.behaviouralQNAs,
    skillGap: Array.isArray(report.skillGap)
        ? report.skillGap.map(parseIfString)
        : report.skillGap,
    preparationPlan: Array.isArray(report.preparationPlan)
        ? report.preparationPlan.map(parseIfString)
        : report.preparationPlan,
});

const resumeConroller = async (req,res)=>{
    const resumeFile = req.file;
    const {selfDescription,jobDescription} = req.body;

    if(!resumeFile){
        return res.status(400).json({
            message:"Resume file is required.",
        });
    }

    const pdf = new PDFParse({
        data: resumeFile.buffer,
    });
    const { text: resumeContent } = await pdf.getText();

    const ReportByAi = await GenerateReport({
        selfDescription,
        jobDescription,
        resume:resumeContent,
    });

    const cleanedReport = normalizeReport(ReportByAi);

    const interviewReport = await ResumeReportModel.create({
        user:req.user.Id,
        userDescription:selfDescription,
        jobDescription,
        resumeContent,
        ...cleanedReport,
    });

    res.status(201).json({
        message:"Resume report generated successfully!",
        cleanedReport,
    })
}

/**
 * @route GET/api/report/interview/:interviewId
 * @description returns the report from backend based on its ID.
 * @access PRIVATE
 */
const getReportById = async(req,res)=>{
    const {interviewId} = req.params;

    const report = await ResumeReportModel.findById(interviewId);

    if(!report){
        return res.status(404).json({
            message:"Report not found.",
        });
    }

    if(req.user.Id.toString() !== report.user.toString()){
        return res.status(403).json({
            message:"You are not authorized to access this report.",
        });
    }
    

    res.status(200).json({
        message:"Report fetched successfully!",
        report,
    });
}

/**
 * @route GET/api/report/allreports
 * @description returns all the reports from backend based on the userID.
 * @access PRIVATE
 */
const getAllReports = async(req,res)=>{
    const reports = await ResumeReportModel.find({user:req.user.Id}).sort({createdAt:-1}).select("-technicalQNAs -behaviouralQNAs -__v -skillGap -preparationPlan -userDescription -jobDescription -resumeContent");

    if(!reports){
        return res.status(404).json({
            message:"there are no reports created by the user"
        });
    }
    res.status(200).json({
        message:"Reports fetched successfully.",
        reports,
    });


}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getReportPDF = async(req,res)=>{
    const {reportId}=req.params;
    const report = await ResumeReportModel.findById(reportId);

    const PDFBuffer = await GeneratePDF({report});
    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=report${reportId}.pdf`
    })


    res.send(PDFBuffer);
}

module.exports={resumeConroller,getReportById,getAllReports,getReportPDF};