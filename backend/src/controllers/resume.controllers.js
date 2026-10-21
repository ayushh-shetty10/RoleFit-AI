const reportService = require("../services/reports/report.service");

/**
 * @route POST /api/report/
 * @description Accepts input from user, creates a ReportJob, enqueues to BullMQ, returns HTTP 202 Accepted
 * @access PRIVATE
 */
const resumeConroller = async (req, res) => {
  try {
    const userId = req.user.id || req.user.Id;
    const { selfDescription = "", jobDescription = "" } = req.body;
    const resumeFile = req.file;

    const reportJob = await reportService.createReportJob({
      userId,
      selfDescription,
      jobDescription,
      resumeFile,
    });

    return res.status(202).json({
      message: "Report generation job accepted.",
      jobId: reportJob._id,
      status: reportJob.status,
    });
  } catch (error) {
    console.error("Generate Report Controller Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Failed to queue interview report generation.",
    });
  }
};

/**
 * @route GET /api/report/jobs/:jobId
 * @description Returns application job status for polling / tracking
 * @access PRIVATE
 */
const getJobStatusController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id || req.user.Id;

    const job = await reportService.getJobStatus({ jobId, userId });

    return res.status(200).json({
      message: "Job status fetched successfully.",
      job,
    });
  } catch (error) {
    console.error("Get Job Status Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error fetching job status.",
    });
  }
};

/**
 * @route GET /api/report/interview/:interviewId
 * @description Returns the completed report from backend based on its ID
 * @access PRIVATE
 */
const getReportById = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const userId = req.user.id || req.user.Id;

    const report = await reportService.getReportById({ interviewId, userId });

    return res.status(200).json({
      message: "Report fetched successfully!",
      report,
    });
  } catch (error) {
    console.error("Get Report By ID Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error fetching report details.",
    });
  }
};

/**
 * @route GET /api/report/allreports
 * @description Returns all completed reports for the authenticated user
 * @access PRIVATE
 */
const getAllReports = async (req, res) => {
  try {
    const userId = req.user.id || req.user.Id;
    const reports = await reportService.getAllUserReports(userId);

    return res.status(200).json({
      message: "Reports fetched successfully.",
      reports,
    });
  } catch (error) {
    console.error("Get All Reports Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Error fetching user reports.",
    });
  }
};

/**
 * @route POST /api/report/pdf/:reportId
 * @description Generate and download PDF report
 * @access PRIVATE
 */
const getReportPDF = async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user.id || req.user.Id;

    const pdfBuffer = await reportService.generateReportPDF({ reportId, userId });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=report_${reportId}.pdf`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Get Report PDF Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({
      message: "Failed to generate PDF.",
    });
  }
};

module.exports = {
  resumeConroller,
  getJobStatusController,
  getReportById,
  getAllReports,
  getReportPDF,
};