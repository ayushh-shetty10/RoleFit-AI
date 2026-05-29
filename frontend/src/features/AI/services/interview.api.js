import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL:apiBaseUrl,
    withCredentials:true
});

export const generateInterviewReport = async({jobDescription,selfDescription,resumeFile}) => {
    const formData = new FormData();
    formData.append("jobDescription",jobDescription);
    formData.append("selfDescription",selfDescription);
    formData.append("resume",resumeFile);

    const response = await api.post("/api/report/",formData,{
        headers:{
            "Content-Type":"multipart/form-data",
        }
    })

    return response.data;
}

export const getOneReport = async(reportId)=>{
    const response = await api.get(`/api/report/interview/${reportId}`);

    return response.data;
}

export const getAllReports = async()=>{
    const response = await api.get("/api/report/allreports");

    return response.data;
}

export const getReportPDF = async(reportId)=>{
     const response = await api.post(`/api/report/pdf/${reportId}`, null, {
        responseType: "blob"
    })

    return response.data;

}