const { createClient } = require('@redis/client');

const redis_client = createClient();

redis_client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

async function connect_redis() {
  if (!redis_client.isOpen) {
    await redis_client.connect();
  }
}

module.exports = { redis_client, connect_redis };