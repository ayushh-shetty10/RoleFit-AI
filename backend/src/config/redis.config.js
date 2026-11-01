require("dotenv").config();

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  maxRetriesPerRequest: null,
};
const dns = require("dns").promises;

async function diagnoseRedis() {
  const host = process.env.REDIS_HOST;

  console.log("[Redis Config]", {
    host,
    port: process.env.REDIS_PORT,
  });

  try {
    const addresses = await dns.lookup(host, { all: true });
    console.log("[Redis DNS SUCCESS]", addresses);
  } catch (error) {
    console.error("[Redis DNS FAILED]", {
      hostname: host,
      code: error.code,
      message: error.message,
    });
  }
}

diagnoseRedis();

module.exports = { redisConnection };
