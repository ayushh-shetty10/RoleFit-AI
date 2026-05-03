# RoleFit-AI

An AI-powered career intelligence platform that analyzes resumes against job descriptions to generate match scores, identify skill gaps, and provide personalized interview questions and preparation plans.

## Overview

RoleFit-AI helps candidates understand how well their resume fits a target role and what they should improve before applying or interviewing. The platform uploads a resume, compares it with a job description, and generates an AI-driven report with practical preparation guidance.

## Key Features

- Resume-to-job matching with an AI-generated match score
- Skill gap detection based on the target role
- Technical and behavioral interview questions with guidance
- Day-wise preparation plan tailored to the role
- PDF export of generated reports
- Authentication with protected report access

## Tech Stack

- Frontend: React, Vite, React Router, SCSS, Axios
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

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

### 3. Run the app

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

## Scripts

### Backend

- `npm start` - run the backend with nodemon

### Frontend

- `npm run dev` - start the Vite dev server
- `npm run build` - build for production
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Project Structure

```text
backend/
  src/
    controllers/
    db/
    middlewares/
    models/
    routes/
    services/
frontend/
  src/
    features/
    styles/
```

## Notes

- Resume uploads are handled in memory and limited to 3 MB.
- Report and PDF endpoints are protected with authentication.
- The app is designed to keep the candidate workflow simple: upload, analyze, review, and prepare.
