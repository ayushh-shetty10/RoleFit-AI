import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
});

export const generateInterviewReport = async({jobDescription,selfDescription,resumeFile}) => {
    const formData = new FormData();
    formData.append("jonDescription",jobDescription);
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