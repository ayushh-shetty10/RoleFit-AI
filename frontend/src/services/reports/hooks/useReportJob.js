import { useState, useRef, useEffect, useCallback } from "react";
import { generateInterviewReport, getReportJobStatus } from "../api/report.api";

const STAGE_MESSAGES = {
  QUEUED: "Your report is queued...",
  PARSING_INPUT: "Preparing your resume and profile...",
  AI_ANALYSIS: "Analyzing your fit for this role...",
  SAVING_REPORT: "Preparing your report...",
  COMPLETED: "Report ready",
  FAILED: "Report generation failed",
};

export const useReportJob = () => {
  const [jobState, setJobState] = useState({
    jobId: null,
    status: null,
    stage: null,
    progress: 0,
    reportId: null,
    error: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useRef to keep track of active setTimeout polling timer and avoid duplicate loops
  const timerRef = useRef(null);

  const clearPollingTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup polling timer when component unmounts
  useEffect(() => {
    return () => {
      clearPollingTimer();
    };
  }, [clearPollingTimer]);

  const pollJobStatus = useCallback(
    async (jobId) => {
      try {
        const response = await getReportJobStatus(jobId);
        const job = response.job;

        setJobState({
          jobId: job.jobId,
          status: job.status,
          stage: job.stage,
          progress: job.progress || 0,
          reportId: job.reportId,
          error: job.error,
        });

        if (job.status === "COMPLETED" || job.status === "FAILED") {
          clearPollingTimer();
          setIsSubmitting(false);
        } else {
          // Schedule next poll cleanly after 1500ms
          clearPollingTimer();
          timerRef.current = setTimeout(() => {
            pollJobStatus(jobId);
          }, 1500);
        }
      } catch (err) {
        console.error("Error polling report job status:", err);
        clearPollingTimer();
        setIsSubmitting(false);
        setJobState((prev) => ({
          ...prev,
          status: "FAILED",
          stage: "FAILED",
          error: err.response?.data?.message || "Failed to fetch report status. Please try again.",
        }));
      }
    },
    [clearPollingTimer]
  );

  const startReportJob = async ({ jobDescription, selfDescription, resumeFile }) => {
    clearPollingTimer();
    setIsSubmitting(true);
    setJobState({
      jobId: null,
      status: "QUEUED",
      stage: "QUEUED",
      progress: 0,
      reportId: null,
      error: null,
    });

    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      const { jobId, status } = response;

      setJobState({
        jobId,
        status: status || "QUEUED",
        stage: "QUEUED",
        progress: 0,
        reportId: null,
        error: null,
      });

      // Begin status polling loop
      pollJobStatus(jobId);
    } catch (err) {
      console.error("Error initiating report job:", err);
      setIsSubmitting(false);
      setJobState({
        jobId: null,
        status: "FAILED",
        stage: "FAILED",
        progress: 0,
        reportId: null,
        error: err.response?.data?.message || "Failed to submit report job. Please try again.",
      });
    }
  };

  const resetJobState = () => {
    clearPollingTimer();
    setIsSubmitting(false);
    setJobState({
      jobId: null,
      status: null,
      stage: null,
      progress: 0,
      reportId: null,
      error: null,
    });
  };

  const stageMessage =
    STAGE_MESSAGES[jobState.stage] ||
    STAGE_MESSAGES[jobState.status] ||
    "Processing your request...";

  return {
    jobState,
    isSubmitting,
    stageMessage,
    startReportJob,
    resetJobState,
  };
};

export default useReportJob;
