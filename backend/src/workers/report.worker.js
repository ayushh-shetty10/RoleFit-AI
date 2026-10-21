require("dotenv").config();
const { Worker } = require("bullmq");
const connectdb = require("../db/db");
const { redisConnection } = require("../config/redis.config");
const { QUEUE_NAME } = require("../queues/report.queue");
const reportService = require("../services/reports/report.service");

// Connect to MongoDB for background processing
connectdb();

console.log(`[Report Worker] Initializing background worker for queue: "${QUEUE_NAME}"...`);

const reportWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(`\n----------------------------------------`);
    console.log(`[Worker] Received Job -> ID: ${job.id} | Name: "${job.name}"`);
    console.log(`[Worker] Job Payload:`, JSON.stringify(job.data, null, 2));

    // Handle Phase 2B-1 test jobs
    if (job.data && job.data.type === "TEST") {
      console.log(`[Worker] Processing TEST job payload: "${job.data.message}"`);
      return {
        status: "COMPLETED",
        type: job.data.type,
        output: { receivedMessage: job.data.message, timestamp: new Date().toISOString() },
      };
    }

    // Handle Phase 2B-2 Async Report Generation jobs
    if (job.data && job.data.reportJobId) {
      console.log(`[Worker] Executing Async Report Generation for ReportJob ID: ${job.data.reportJobId}`);
      const createdReport = await reportService.processAsyncReportJob(job.data.reportJobId);
      console.log(`[Worker] Successfully generated report. Report ID: ${createdReport._id}`);
      return {
        status: "COMPLETED",
        reportJobId: job.data.reportJobId,
        reportId: createdReport._id,
      };
    }

    console.warn(`[Worker] Unhandled job payload structure:`, job.data);
    return { status: "SKIPPED", reason: "Unknown job payload" };
  },
  {
    connection: redisConnection,
    concurrency: 1,
  }
);

reportWorker.on("active", (job) => {
  console.log(`[Worker Event] Job ${job.id} is now ACTIVE (Processing...)`);
});

reportWorker.on("completed", (job, returnvalue) => {
  console.log(`[Worker Event] Job ${job.id} HAS COMPLETED! Output:`, JSON.stringify(returnvalue));
  console.log(`----------------------------------------\n`);
});

reportWorker.on("failed", (job, err) => {
  console.error(`[Worker Event] Job ${job?.id} HAS FAILED with error:`, err.message);
});

reportWorker.on("error", (err) => {
  console.error(`[Worker Event] Worker Connection Error:`, err.message);
});

// Graceful shutdown handling
const shutdown = async () => {
  console.log("\n[Worker Process] Shutting down worker gracefully...");
  await reportWorker.close();
  console.log("[Worker Process] Worker closed. Exiting process.");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = { reportWorker };
