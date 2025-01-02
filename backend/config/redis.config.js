const redis = require("redis");

const redis_client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});


// Ensure Redis connection is open before attempting to use it
async function connectRedis() {
  if (!redis_client.isOpen) {
    try {
      await redis_client.connect();
      console.log("Connected to Redis.");
    } catch (err) {
      console.error("Failed to connect to Redis:", err);
    }
  }
}

connectRedis();

process.on("SIGINT", async () => {
  await redis_client.quit(); // Graceful shutdown
  console.log("Redis connection closed.");
  process.exit(0);
});

module.exports = { redis_client };
