import {useContext, useEffect} from "react";
import {interviewContext} from "../Interview.context.jsx";
import { generateInterviewReport, getAllReports, getOneReport, getReportPDF } from "../services/interview.api";
import { useParams } from "react-router";


export const useInterview=()=>{
    const context=useContext(interviewContext);
    const { interviewId } = useParams()

    if(!context){
        throw new Error("useInterview must be used within an interviewProvider");
    }
    const {loading,setLoading,report,setReport,reports,setReports}= context;

    const generateInterviewReportFunc=async({jobDescription,selfDescription,resumeFile})=>{
        setLoading(true);
        try{
            const response= await generateInterviewReport({jobDescription,selfDescription,resumeFile});
            const createdReport = response.cleanedReport || response.report;
            setReport(createdReport);
            return createdReport;
        }catch(err){
            console.log("Error generating report:", err);
            throw err;
        }finally{
            setLoading(false);
        }
    }

    const getOneReportFunc = async(reportId)=>{
        setLoading(true);
        try{
            const response = await getOneReport(reportId);
            setReport(response.report);
            return response.report;
        }catch(err){
            console.log("Error fetching report:", err);
        }finally{
            setLoading(false);
        }
    }

    const getAllReportsFunc = async()=>{
        setLoading(true);
        try{
            const response = await getAllReports();
            setReports(response.reports || []);
        }catch(err){
            console.log("Error fetching all reports:", err);
        }finally{
            setLoading(false);
        }
    }

    const getReportPDFFunc = async (interviewReportId) => {
        setLoading(true);
        let url = null;
        try {
            const response = await getReportPDF(interviewReportId);
            const blob = new Blob([ response ], { type: "application/pdf" });
            url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `report_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.log("Error fetching PDF:", error);
        } finally {
            if (url) {
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getOneReportFunc(interviewId)
        }else{
            getAllReportsFunc();
        }
    }, [ interviewId ])

    return {loading,report,reports,generateInterviewReportFunc,getOneReportFunc,getAllReportsFunc,getReportPDFFunc}
}


    