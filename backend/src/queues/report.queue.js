const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis.config");

const QUEUE_NAME = "report-generation";

const reportQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
});

reportQueue.on("error", (err) => {
  console.error(`[Queue:${QUEUE_NAME}] Connection Error:`, err.message);
});

/**
 * Add a test job to the report-generation queue
 */
async function addTestJob(data = { type: "TEST", message: "RoleFit queue test" }) {
  const job = await reportQueue.add("test-job", data, {
    removeOnComplete: 100,
    removeOnFail: 200,
  });
  return job;
}

/**
 * Add an async report generation job to the queue
 */
async function addReportGenerationJob({ reportJobId, userId }) {
  const job = await reportQueue.add(
    "generate-report",
    {
      reportJobId,
      userId,
    },
    {
      removeOnComplete: 200,
      removeOnFail: 500,
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    }
  );
  return job;
}

module.exports = {
  QUEUE_NAME,
  reportQueue,
  addTestJob,
  addReportGenerationJob,
};
