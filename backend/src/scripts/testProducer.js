const { addTestJob, reportQueue } = require("../queues/report.queue");

async function runProducerTest() {
  console.log("\n========================================");
  console.log("[Test Producer] Dispatching test job to BullMQ queue...");
  
  try {
    const testPayload = {
      type: "TEST",
      message: `RoleFit queue test timestamp: ${new Date().toISOString()}`,
    };

    const job = await addTestJob(testPayload);

    console.log(`[Test Producer] SUCCESS! Job added to queue.`);
    console.log(`[Test Producer] Job ID: ${job.id}`);
    console.log(`[Test Producer] Queue Name: "${job.queueName}"`);
    console.log(`[Test Producer] Initial State: WAITING`);
    console.log("========================================\n");
  } catch (error) {
    console.error("[Test Producer] Failed to dispatch test job:", error.message);
  } finally {
    try {
      await reportQueue.close();
    } catch {
      // ignore disconnect error on exit
    }
    process.exit(0);
  }
}

runProducerTest();
