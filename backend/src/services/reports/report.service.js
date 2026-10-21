const pdfParseModule = require("pdf-parse");
const { GenerateReport, GeneratePDF } = require("../ai/ai.service");
const { ResumeReportModel } = require("../../models/ResumeReport.model");
const { ReportJobModel } = require("../../models/ReportJob.model");
const { addReportGenerationJob } = require("../../queues/report.queue");

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

const sanitizeQnAArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(parseIfString)
    .filter((item) => item && typeof item === "object" && (item.question || item.answer))
    .map((item) => ({
      question: String(item.question || "Technical Question"),
      intention: String(item.intention || "Assess technical domain competence"),
      answer: String(item.answer || "Detailed answer response"),
    }));
};

const sanitizeSkillGapArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(parseIfString)
    .filter((item) => item && typeof item === "object" && item.skill)
    .map((item) => ({
      skill: String(item.skill || ""),
      severity: ["low", "medium", "high"].includes(String(item.severity).toLowerCase())
        ? String(item.severity).toLowerCase()
        : "medium",
    }));
};

const sanitizePrepPlanArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(parseIfString)
    .filter((item) => item && typeof item === "object" && (item.focus || item.tasks))
    .map((item) => ({
      day: item.day || 1,
      focus: String(item.focus || "Core skill reinforcement"),
      tasks: Array.isArray(item.tasks) ? item.tasks.map(String) : [String(item.tasks || "Review concepts")],
    }));
};

const normalizeReport = (report) => ({
  ...report,
  matchScore: typeof report.matchScore === "number" ? report.matchScore : 75,
  technicalQNAs: sanitizeQnAArray(report.technicalQNAs),
  behaviouralQNAs: sanitizeQnAArray(report.behaviouralQNAs),
  skillGap: sanitizeSkillGapArray(report.skillGap),
  preparationPlan: sanitizePrepPlanArray(report.preparationPlan),
});

/**
 * Extract plain text from PDF file buffer safely
 */
async function extractTextFromPdfBuffer(buffer) {
  if (!buffer) return "";
  try {
    if (typeof pdfParseModule === "function") {
      const parsedData = await pdfParseModule(buffer);
      return (parsedData.text || "").trim();
    } else if (pdfParseModule.PDFParse) {
      const pdfInstance = new pdfParseModule.PDFParse({ data: buffer });
      const pdfTextObj = await pdfInstance.getText();
      return (typeof pdfTextObj === "string" ? pdfTextObj : (pdfTextObj.text || "")).trim();
    }
  } catch (pdfErr) {
    console.error("PDF Parsing Error:", pdfErr);
  }
  return "";
}

/**
 * Create a persistent ReportJob and dispatch to BullMQ background queue
 */
async function createReportJob({ userId, selfDescription = "", jobDescription = "", resumeFile }) {
  if (!jobDescription || !jobDescription.trim()) {
    const error = new Error("Job description is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!resumeFile && (!selfDescription || !selfDescription.trim())) {
    const error = new Error("Either a Resume file or a Self Description is required.");
    error.statusCode = 400;
    throw error;
  }

  let resumeContent = "";
  if (resumeFile && resumeFile.buffer) {
    resumeContent = await extractTextFromPdfBuffer(resumeFile.buffer);

    if (!resumeContent && (!selfDescription || !selfDescription.trim())) {
      const error = new Error("Could not extract readable text from the uploaded PDF. Please upload a PDF with selectable text or enter a Self Description.");
      error.statusCode = 400;
      throw error;
    }
  }

  // Create persistent application job in MongoDB
  const reportJob = await ReportJobModel.create({
    user: userId,
    jobDescription,
    userDescription: selfDescription,
    resumeContent: resumeContent || selfDescription,
    status: "QUEUED",
    stage: "QUEUED",
    progress: 0,
  });

  // Dispatch job to BullMQ queue
  try {
    await addReportGenerationJob({
      reportJobId: reportJob._id.toString(),
      userId: userId.toString(),
    });
  } catch (queueErr) {
    console.error("Failed to enqueue job to BullMQ:", queueErr);
    reportJob.status = "FAILED";
    reportJob.stage = "FAILED";
    reportJob.error = "Failed to queue background job. Please try again.";
    await reportJob.save();
    const error = new Error("Failed to queue background report job.");
    error.statusCode = 500;
    throw error;
  }

  return reportJob;
}

/**
 * Get job status details by ID with strict ownership authorization check
 */
async function getJobStatus({ jobId, userId }) {
  const reportJob = await ReportJobModel.findById(jobId);

  if (!reportJob) {
    const error = new Error("Report job not found.");
    error.statusCode = 404;
    throw error;
  }

  if (userId.toString() !== reportJob.user.toString()) {
    const error = new Error("You are not authorized to access this job status.");
    error.statusCode = 403;
    throw error;
  }

  return {
    jobId: reportJob._id,
    status: reportJob.status,
    stage: reportJob.stage,
    progress: reportJob.progress,
    reportId: reportJob.report,
    error: reportJob.error,
    createdAt: reportJob.createdAt,
    startedAt: reportJob.startedAt,
    completedAt: reportJob.completedAt,
  };
}

/**
 * Process report generation asynchronously in worker process
 * Phase 2C Truthful Stage Transitions with EXACTLY ONE Gemini AI Call
 */
async function processAsyncReportJob(reportJobId) {
  const reportJob = await ReportJobModel.findById(reportJobId);
  if (!reportJob) {
    throw new Error(`ReportJob with ID ${reportJobId} not found.`);
  }

  if (reportJob.status === "COMPLETED") {
    console.log(`[Worker] Job ${reportJobId} is already COMPLETED. Skipping.`);
    return reportJob;
  }

  try {
    // Stage 1: PARSING_INPUT (15%)
    reportJob.status = "PROCESSING";
    reportJob.stage = "PARSING_INPUT";
    reportJob.progress = 15;
    reportJob.startedAt = new Date();
    await reportJob.save();

    const candidateProfile = reportJob.resumeContent || reportJob.userDescription;
    if (!reportJob.jobDescription || !candidateProfile) {
      throw new Error("Invalid or unreadable job profile input.");
    }

    // Stage 2: AI_ANALYSIS (40%) -> Invoking EXACTLY ONE Gemini AI Request
    reportJob.stage = "AI_ANALYSIS";
    reportJob.progress = 40;
    await reportJob.save();

    const reportByAi = await GenerateReport({
      selfDescription: reportJob.userDescription,
      jobDescription: reportJob.jobDescription,
      resume: candidateProfile,
    });

    // Gemini response received -> Progress updated to 80%
    reportJob.progress = 80;
    await reportJob.save();

    // Stage 3: SAVING_REPORT (90%) -> Normalizing & persisting in MongoDB
    reportJob.stage = "SAVING_REPORT";
    reportJob.progress = 90;
    await reportJob.save();

    const cleanedReport = normalizeReport(reportByAi);

    const interviewReport = await ResumeReportModel.create({
      user: reportJob.user,
      userDescription: reportJob.userDescription,
      jobDescription: reportJob.jobDescription,
      resumeContent: candidateProfile,
      title: cleanedReport.title || "Interview Strategy Plan",
      ...cleanedReport,
    });

    // Stage 4: COMPLETED (100%) -> Link report ID & set completedAt timestamp
    reportJob.status = "COMPLETED";
    reportJob.stage = "COMPLETED";
    reportJob.progress = 100;
    reportJob.report = interviewReport._id;
    reportJob.completedAt = new Date();
    await reportJob.save();

    return interviewReport;
  } catch (err) {
    console.error(`[Worker Error] Processing failed for Job ID ${reportJobId}:`, err);
    reportJob.status = "FAILED";
    reportJob.stage = "FAILED";
    reportJob.progress = 0;
    reportJob.error = err.message || "Failed to generate report.";
    await reportJob.save();
    throw err;
  }
}

/**
 * Get detailed report by ID with ownership authorization check
 */
async function getReportById({ interviewId, userId }) {
  const report = await ResumeReportModel.findById(interviewId);

  if (!report) {
    const error = new Error("Report not found.");
    error.statusCode = 404;
    throw error;
  }

  if (userId.toString() !== report.user.toString()) {
    const error = new Error("You are not authorized to access this report.");
    error.statusCode = 403;
    throw error;
  }

  return report;
}

/**
 * Get all historical reports for a specific user
 */
async function getAllUserReports(userId) {
  const reports = await ResumeReportModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .select("-technicalQNAs -behaviouralQNAs -__v -skillGap -preparationPlan -userDescription -jobDescription -resumeContent");

  return reports || [];
}

/**
 * Generate PDF buffer for an existing report with ownership authorization check
 */
async function generateReportPDF({ reportId, userId }) {
  const report = await ResumeReportModel.findById(reportId);

  if (!report) {
    const error = new Error("Report not found.");
    error.statusCode = 404;
    throw error;
  }

  if (userId.toString() !== report.user.toString()) {
    const error = new Error("You are not authorized to download this report.");
    error.statusCode = 403;
    throw error;
  }

  const pdfBuffer = await GeneratePDF({ report });
  return pdfBuffer;
}

module.exports = {
  createReportJob,
  getJobStatus,
  processAsyncReportJob,
  getReportById,
  getAllUserReports,
  generateReportPDF,
};
