# RoleFit-AI

An AI-powered career intelligence platform that analyzes resumes against job descriptions to generate match scores, identify skill gaps, and provide personalized interview questions and preparation plans.



## Key Features

- Resume-to-job matching with an AI-generated match score
- Skill gap detection based on the target role
- Technical and behavioral interview questions with guidance
- Day-wise preparation plan tailored to the role
- PDF export of generated reports
- Authentication with protected report access

## Stack

- Frontend: React, Vite, React Router, Axios, CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- AI: Google Gemini API via `@google/genai`
- Auth: JWT, cookies
- File handling: Multer
- Resume parsing: `pdf-parse`
- PDF generation: Puppeteer
- Validation: Zod

## API Surface

### Auth

- `POST /api/auth/register` - register a user
- `POST /api/auth/login` - log in
- `POST /api/auth/logout` - log out
- `GET /api/auth/get-me` - get the current user

### Reports

- `POST /api/report/` - upload resume and generate a report
- `GET /api/report/interview/:interviewId` - fetch one report
- `GET /api/report/allreports` - fetch all reports for the user
- `POST /api/report/pdf/:reportId` - generate/download the PDF report

## External Integrations

- Google Gemini API for report generation and PDF HTML generation
- MongoDB Atlas for storing users and reports



## Scripts

- Backend: `npm start`, `npm run dev`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`
