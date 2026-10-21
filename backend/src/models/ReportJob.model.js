const mongoose = require("mongoose");

const ReportJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "COMPLETED", "FAILED"],
      default: "QUEUED",
    },
    stage: {
      type: String,
      enum: [
        "QUEUED",
        "PARSING_INPUT",
        "AI_ANALYSIS",
        "SAVING_REPORT",
        "COMPLETED",
        "FAILED",
      ],
      default: "QUEUED",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    userDescription: {
      type: String,
      default: "",
    },
    resumeContent: {
      type: String,
      default: "",
    },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeReport",
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ReportJobModel = mongoose.model("ReportJob", ReportJobSchema);

module.exports = { ReportJobModel };
