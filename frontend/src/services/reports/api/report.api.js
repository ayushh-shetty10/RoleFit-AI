import axios from "axios";

//const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: "https://rolefit-ai-nzqp.onrender.com/api/report",
  withCredentials: true,
});

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  if (jobDescription) formData.append("jobDescription", jobDescription);
  if (selfDescription) formData.append("selfDescription", selfDescription);
  if (resumeFile) formData.append("resume", resumeFile);

  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getReportJobStatus = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

export const getOneReport = async (reportId) => {
  const response = await api.get(`/interview/${reportId}`);
  return response.data;
};

export const getAllReports = async () => {
  const response = await api.get("/allreports");
  return response.data;
};

export const getReportPDF = async (reportId) => {
  const response = await api.post(`/pdf/${reportId}`, null, {
    responseType: "blob",
  });
  return response.data;
};
