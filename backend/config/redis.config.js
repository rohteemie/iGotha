const { createClient } = require('@redis/client');

// Create and configure a Redis client
const redis_client = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Retry strategy
  },
  password: process.env.REDIS_PASSWORD || undefined, // Optional

});

// Handle connection events
redis_client.on('connect', () => {
  console.log('Connected to Redis');
});

redis_client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Function to connect the Redis client
async function connect_redis() {
  if (!redis_client.isOpen) {
    try {
      await redis_client.connect();
      console.log('Redis client connected');
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }
}

// Export the Redis client and the connect function
module.exports = { redis_client, connect_redis };
