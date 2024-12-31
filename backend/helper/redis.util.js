// redis.util.js
const { redis_client, connect_redis } = require('../config/redis.config'); // Import Redis client

const redisUtil = {
  get: async (key) => {
    try {
	  await connect_redis();
      const data = await redis_client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Redis GET error: ${error.message}`);
      return null;
    }
  },

  set: async (key, value, ttl = 3600) => {
    try {
	  await connect_redis();
      const data = JSON.stringify(value);
      if (ttl) {
        await redis_client.set(key, data, 'EX', ttl);
      } else {
        await redis_client.set(key, data);
      }
    } catch (error) {
      console.error(`Redis SET error: ${error.message}`);
    }
  },

  del: async (key) => {
    try {
	  await connect_redis();
      await redis_client.del(key);
    } catch (error) {
      console.error(`Redis DEL error: ${error.message}`);
    }
  },
};

module.exports = redisUtil;
