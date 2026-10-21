require("dotenv").config();
const connectdb = require("../db/db");
const { userModel } = require("../models/user.model");
const { ReportJobModel } = require("../models/ReportJob.model");
const reportService = require("../services/reports/report.service");
const { reportWorker } = require("../workers/report.worker");

async function runTestPipeline() {
  console.log("\n========================================");
  console.log("[Test Script] Starting Phase 2C Async Pipeline Test...");
  console.log("========================================\n");

  try {
    await connectdb();

    // 1. Get or create test user
    let user = await userModel.findOne();
    if (!user) {
      user = await userModel.create({
        username: "testuser_phase2c",
        email: "testuser_phase2c@example.com",
        password: "Password123!",
      });
      console.log(`[Test Script] Created temporary test user: ${user._id}`);
    } else {
      console.log(`[Test Script] Using existing user: ${user._id} (${user.username})`);
    }

    // 2. Dispatch async report job via reportService.createReportJob
    console.log("\n[Step 1] Dispatching Async Report Creation...");
    const reportJob = await reportService.createReportJob({
      userId: user._id,
      jobDescription: "We are seeking a React & Node.js Developer skilled in building modular full-stack applications.",
      selfDescription: "Full-stack JavaScript developer with experience in React, Node.js, Express, MongoDB, and Tailwind CSS.",
    });

    console.log(`[Step 1 SUCCESS] ReportJob Created in DB! ID: ${reportJob._id}`);
    console.log(`[Step 1 SUCCESS] Initial Status: ${reportJob.status} | Stage: ${reportJob.stage} | Progress: ${reportJob.progress}%`);

    // 3. Poll initial job status
    console.log("\n[Step 2] Querying Job Status via getJobStatus...");
    const initialStatus = await reportService.getJobStatus({
      jobId: reportJob._id,
      userId: user._id,
    });
    console.log(`[Step 2 SUCCESS] Status returned:`, initialStatus);

    // 4. Verify Ownership Security Check
    console.log("\n[Step 3] Testing Ownership Security (Different User ID)...");
    const fakeUserId = "60c72b2f9b1d8b0015f8b999";
    try {
      await reportService.getJobStatus({ jobId: reportJob._id, userId: fakeUserId });
      console.error("[Step 3 FAILED] Security check failed: Authorized unauthorized user!");
    } catch (secErr) {
      console.log(`[Step 3 SUCCESS] Security check caught unauthorized access correctly: "${secErr.message}" (Status: ${secErr.statusCode})`);
    }

    // 5. Allow worker to process job
    console.log("\n[Step 4] Waiting 20 seconds for Background Worker to process job...");

    await new Promise((resolve) => setTimeout(resolve, 20000));

    // 6. Check completed status
    console.log("\n[Step 5] Polling Final Job Status...");
    const finalStatus = await reportService.getJobStatus({
      jobId: reportJob._id,
      userId: user._id,
    });
    console.log(`[Step 5 SUCCESS] Final Job Status:`, finalStatus);

    if (finalStatus.status === "COMPLETED") {
      console.log(`\n========================================`);
      console.log(`[SUCCESS] Phase 2C Async Report Pipeline Test PASSED!`);
      console.log(`Generated Report ID: ${finalStatus.reportId}`);
      console.log(`Final Stage: ${finalStatus.stage} | Progress: ${finalStatus.progress}%`);
      console.log(`========================================\n`);
    } else {
      console.log(`\n========================================`);
      console.log(`[PARTIAL / PENDING] Job Status is: ${finalStatus.status} (${finalStatus.stage})`);
      console.log(`========================================\n`);
    }

  } catch (err) {
    console.error("\n[Test Script Error] Pipeline test failed:", err);
  } finally {
    await reportWorker.close();
    process.exit(0);
  }
}

runTestPipeline();
