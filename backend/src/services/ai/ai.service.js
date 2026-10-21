const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer");

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Native Gemini OpenAPI Schema definitions using @google/genai Type enum
const reportResponseSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description: "Match score between 0 and 100 indicating how well the candidate fits the job description.",
    },
    title: {
      type: Type.STRING,
      description: "Target job position title, e.g. 'Senior React Developer'",
    },
    technicalQNAs: {
      type: Type.ARRAY,
      description: "List of relevant technical interview questions, intention, and model answers.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Common technical question related to the job" },
          intention: { type: Type.STRING, description: "Intention behind asking this question" },
          answer: { type: Type.STRING, description: "Detailed model answer and key points" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behaviouralQNAs: {
      type: Type.ARRAY,
      description: "List of relevant behavioural interview questions, intention, and model answers.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Common behavioural question related to the job" },
          intention: { type: Type.STRING, description: "Intention behind asking this question" },
          answer: { type: Type.STRING, description: "Detailed model answer and key points" },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGap: {
      type: Type.ARRAY,
      description: "List of missing or underrepresented candidate skills required for the job.",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING, description: "Name of missing or underrepresented skill" },
          severity: {
            type: Type.STRING,
            enum: ["low", "medium", "high"],
            description: "Severity level of skill gap",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: Type.ARRAY,
      description: "Day-by-day interview preparation roadmap.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "Day number in preparation plan (1, 2, 3, etc.)" },
          focus: { type: Type.STRING, description: "Primary focus area for the day" },
          tasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actionable preparation tasks for the day",
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "title",
    "technicalQNAs",
    "behaviouralQNAs",
    "skillGap",
    "preparationPlan",
  ],
};

const pdfHtmlResponseSchema = {
  type: Type.OBJECT,
  properties: {
    html: {
      type: Type.STRING,
      description: "Well-styled HTML string containing all report sections suitable for Puppeteer PDF conversion.",
    },
  },
  required: ["html"],
};

const safeJsonParse = (rawText) => {
  if (!rawText) return {};
  let text = rawText.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\n?/i, "").replace(/```$/, "").trim();
  }
  return JSON.parse(text);
};

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
];

const generateWithFallback = async ({ prompt, schema }) => {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });
      return response;
    } catch (err) {
      console.warn(`Gemini Model [${model}] unavailable (${err.status || err.code || err.message}). Switching to next fallback...`);
      lastError = err;
    }
  }
  throw lastError;
};

/**
 * Generate structured interview strategy analysis from Gemini AI
 */
async function GenerateReport({ selfDescription, resume, jobDescription }) {
  const prompt = `
    Given the following job description, self description and resume, please generate a comprehensive interview report that includes:
    1. matchScore: A score between 0 and 100 indicating how well the resume matches the job description.
    2. title: A descriptive job title for the position being targeted.
    3. technicalQNAs: At least 3 to 5 technical questions, intentions, and detailed answers relevant to the job requirements.
    4. behaviouralQNAs: At least 3 to 5 behavioural questions, intentions, and detailed STAR-method model answers relevant to the role.
    5. skillGap: Critical skills required for the job but underrepresented in the resume, each with a severity level (low, medium, high).
    6. preparationPlan: A day-by-day plan (day integer, focus area, tasks array) outlining actionable prep steps.

    Job Description: ${jobDescription}
    Self Description: ${selfDescription}
    Resume: ${resume}
  `;

  const response = await generateWithFallback({ prompt, schema: reportResponseSchema });
  return safeJsonParse(response.text);
}

/**
 * Convert HTML string to PDF buffer using Puppeteer
 */
async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

/**
 * Generate formatted PDF buffer for a report via Gemini HTML layout & Puppeteer
 */
async function GeneratePDF({ report }) {
  const prompt = `
    Given the following report, generate a well-formatted html that includes all the sections in a visually appealing way.
    make sure that the generated report's html is well styled and contains all the info which is present in the given report.
    This html should be easily used by any pdf maker package like puppeteer. 
    the format of the output should be a JSON which has a single key called html and the result html should be paired with that key.
    Report: ${JSON.stringify(report)}`;

  const response = await generateWithFallback({ prompt, schema: pdfHtmlResponseSchema });
  const jsonContent = safeJsonParse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

module.exports = {
  GenerateReport,
  GeneratePDF,
};
