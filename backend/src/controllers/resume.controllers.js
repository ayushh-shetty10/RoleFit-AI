const pdfParseModule = require("pdf-parse");
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
    try {
        const resumeFile = req.file;
        const {selfDescription = "", jobDescription = ""} = req.body;

        if(!jobDescription || !jobDescription.trim()){
            return res.status(400).json({
                message:"Job description is required.",
            });
        }

        if(!resumeFile && (!selfDescription || !selfDescription.trim())){
            return res.status(400).json({
                message:"Either a Resume file or a Self Description is required.",
            });
        }

        let resumeContent = "";
        if (resumeFile && resumeFile.buffer) {
            try {
                if (typeof pdfParseModule === "function") {
                    const parsedData = await pdfParseModule(resumeFile.buffer);
                    resumeContent = (parsedData.text || "").trim();
                } else if (pdfParseModule.PDFParse) {
                    const pdfInstance = new pdfParseModule.PDFParse({ data: resumeFile.buffer });
                    const pdfTextObj = await pdfInstance.getText();
                    resumeContent = (typeof pdfTextObj === "string" ? pdfTextObj : (pdfTextObj.text || "")).trim();
                }
            } catch (pdfErr) {
                console.error("PDF Parsing Error:", pdfErr);
            }

            if (!resumeContent && (!selfDescription || !selfDescription.trim())) {
                return res.status(400).json({
                    message: "Could not extract readable text from the uploaded PDF. Please upload a PDF with selectable text or enter a Self Description.",
                });
            }
        }

        const userId = req.user.id || req.user.Id;

        const ReportByAi = await GenerateReport({
            selfDescription,
            jobDescription,
            resume: resumeContent || selfDescription,
        });

        const cleanedReport = normalizeReport(ReportByAi);

        const interviewReport = await ResumeReportModel.create({
            user: userId,
            userDescription: selfDescription,
            jobDescription,
            resumeContent: resumeContent || selfDescription,
            title: cleanedReport.title || "Interview Strategy Plan",
            ...cleanedReport,
        });

        return res.status(201).json({
            message:"Resume report generated successfully!",
            cleanedReport: interviewReport,
        });
    } catch(error) {
        console.error("Generate Report Controller Error:", error);
        return res.status(500).json({
            message: "Failed to generate interview report. Please try again.",
        });
    }
}

/**
 * @route GET/api/report/interview/:interviewId
 * @description returns the report from backend based on its ID.
 * @access PRIVATE
 */
const getReportById = async(req,res)=>{
    try {
        const {interviewId} = req.params;
        const userId = req.user.id || req.user.Id;

        const report = await ResumeReportModel.findById(interviewId);

        if(!report){
            return res.status(404).json({
                message:"Report not found.",
            });
        }

        if(userId.toString() !== report.user.toString()){
            return res.status(403).json({
                message:"You are not authorized to access this report.",
            });
        }

        return res.status(200).json({
            message:"Report fetched successfully!",
            report,
        });
    } catch(error) {
        console.error("Get Report By ID Error:", error);
        return res.status(500).json({
            message: "Error fetching report details.",
        });
    }
}

/**
 * @route GET/api/report/allreports
 * @description returns all the reports from backend based on the userID.
 * @access PRIVATE
 */
const getAllReports = async(req,res)=>{
    try {
        const userId = req.user.id || req.user.Id;
        const reports = await ResumeReportModel.find({user: userId})
            .sort({createdAt:-1})
            .select("-technicalQNAs -behaviouralQNAs -__v -skillGap -preparationPlan -userDescription -jobDescription -resumeContent");

        return res.status(200).json({
            message:"Reports fetched successfully.",
            reports: reports || [],
        });
    } catch(error) {
        console.error("Get All Reports Error:", error);
        return res.status(500).json({
            message: "Error fetching user reports.",
        });
    }
}

/**
 * @route POST/api/report/pdf/:reportId
 * @description generate and download PDF report
 * @access PRIVATE
 */
const getReportPDF = async(req,res)=>{
    try {
        const {reportId} = req.params;
        const userId = req.user.id || req.user.Id;

        const report = await ResumeReportModel.findById(reportId);

        if(!report){
            return res.status(404).json({
                message:"Report not found.",
            });
        }

        if(userId.toString() !== report.user.toString()){
            return res.status(403).json({
                message:"You are not authorized to download this report.",
            });
        }

        const PDFBuffer = await GeneratePDF({report});
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=report_${reportId}.pdf`
        });

        return res.send(PDFBuffer);
    } catch(error) {
        console.error("Get Report PDF Error:", error);
        return res.status(500).json({
            message: "Failed to generate PDF.",
        });
    }
}

module.exports={resumeConroller,getReportById,getAllReports,getReportPDF};