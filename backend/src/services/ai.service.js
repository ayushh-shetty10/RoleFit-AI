const  {GoogleGenAI} = require("@google/genai");
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema");
const puppeteer = require("puppeteer");



// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

// async function AiCheck() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Is this gemini-2.5-flash free to use, if no, how much can i use this api freely?",
//   });
//   console.log(response.text);
// }

const responseSchema = z.object({
    matchScore:z.number().min(0).max(100),
    technicalQNAs:z.array(z.object({
        question:z.string().describe("Common technical questions related to the job"),
        intention:z.string().describe(`
            The intention behind asking this question in the interview, i.e., what the interviewer is trying to assess by asking this question`),
        answer:z.string().describe(`
            A detailed answer that mentions what all the important things to keep in mind while answering that question and how to answer such questions,etc.`),
    })),
    behaviouralQNAs:z.array(z.object({
 question:z.string().describe("Common Behavioural questions related to the job"),
        intention:z.string().describe(`
            The intention behind asking this question in the interview, i.e., what the interviewer is trying to assess by asking this question`),
        answer:z.string().describe(`
            A detailed answer that mentions what all the important things to keep in mind while answering that question and how to answer such questions,etc.`),
    })),
    skillGap:z.array(z.object({
        skill:z.string().describe("A skill that is required for the job but is missing or underrepresented in the resume"),
        severity:z.enum(["low","medium","high"]).describe("A severity level that indicates how critical the skill is for the job"),
    })),
    preparationPlan:z.array(z.object({
        day:z.number().describe("The day number in the preparation plan"),
        focus:z.string().describe("The focus area for that day based on the identified skill gaps and relevant questions"),
        tasks:z.array(z.string()).describe("A list of tasks to be completed on that day to prepare for the job interview"),
    })),
    title:z.string().describe("A title for the JOB about which the user is a trying to apply for.")
});


async function GenerateReport ({selfDescription,resume,jobDescription}){

    const prompt = `
    Given the following job description, self description and resume, please generate a report that includes the following sections:
    1. matchScore: A score between 0 and 100 that indicates how well the resume matches the job description.
    2. Technical QNAs: A list of technical questions and answers that are relevant to the job description. Each question should have an intention that explains why the question is relevant and an answer that mentions what all the important things to keep in mind while answering that question and how to answer such questions,etc.
    3. Behavioural QNAs: A list of behavioural questions and answers that are relevant to the job description. Each question should have an intention that explains why the question is relevant and an  answer that mentions what all the important things to keep in mind while answering that question and how to answer such questions,etc.
    4. Skill Gap: A list of skills that are required for the job but are missing or underrepresented in the resume. Each skill should have a severity level (low, medium, high) that indicates how critical the skill is for the job.
    5. Preparation Plan: A day-by-day plan that outlines the tasks and focus(areas for preparing for the job interview based on the identified skill gaps and relevant questions).
    Job Description: ${jobDescription}
    Self Description: ${selfDescription}
    Resume: ${resume}
    also maintain the report format as the mentioned schema , keep in mind to return everything as json parsed and that technicalQNAs,etc are arrays of objects(json) and not arrays of strings.
    `;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:prompt,
        config:{
             responseMimeType: "application/json",
            responseSchema:zodToJsonSchema(responseSchema),
        }
    });

    // // Remove markdown code blocks and parse
    // const text = response.text.trim();
    //  const jsonStr = text.startsWith('```') ? text.slice(text.indexOf('\n') + 1, text.lastIndexOf('```')) : text;
    console.log(JSON.parse(response.text));
     return JSON.parse(response.text)
    // return JSON.parse(jsonStr);


}

const PDF_htmlSchema = z.object({
    html:z.string().describe("A well-formatted HTML string that includes all the sections of the report in a visually appealing way, suitable for PDF generation with packages like Puppeteer.")
})

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function GeneratePDF ({report}){


    const prompt = `
    Given the following report, generate a well-formatted html that includes all the sections in a visually appealing way.
    make sure that the generated report's html is well styled and contains all the info which is present in the given report.
    This html should be easily used by any pdf maker package like puppeteer. 
    the format of the output should be a JSON which has a single key called html and the result html should be paired with that key.
    Report: ${JSON.stringify(report)}`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents:prompt,
        config:{
             responseMimeType: "application/json",
            responseSchema:zodToJsonSchema(PDF_htmlSchema),
        }
    });

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer;
}

module.exports={GenerateReport,GeneratePDF};