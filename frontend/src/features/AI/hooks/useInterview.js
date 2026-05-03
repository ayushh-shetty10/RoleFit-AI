import {useContext, useEffect} from "react";
import {interviewContext} from "../interview.context";
import { generateInterviewReport, getAllReports, getOneReport, getReportPDF } from "../services/interview.api";
import { useParams } from "react-router";


export const useInterview=()=>{
    const context=useContext(interviewContext);
      const { interviewId } = useParams()

   
    if(!context){
        throw new Error("useInterview must be used within an interviewProvider");
    }
    const {loading,setLoading,report,setReport,reports,setReports}= context;

    useEffect(() => {
        if (interviewId) {
            getOneReportFunc(interviewId)
        }else{
            getAllReportsFunc();
        }
    }, [ interviewId ])

    const generateInterviewReportFunc=async({jobDescription,selfDescription,resumeFile})=>{
        setLoading(true);
        try{
            const response= await generateInterviewReport({jobDescription,selfDescription,resumeFile});
            setReport(response.cleanedReport);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const getOneReportFunc = async(reportId)=>{
        setLoading(true);
        try{
            const response = await getOneReport(reportId);
            setReport(response.report);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);

        }
    }

    const getAllReportsFunc = async()=>{
        setLoading(true);
        try{
            const response = await getAllReports();
            setReports(response.reports);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

      const getReportPDFFunc = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await getReportPDF(interviewReportId )
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return {loading,report,reports,generateInterviewReportFunc,getOneReportFunc,getAllReportsFunc,getReportPDFFunc}
}


    