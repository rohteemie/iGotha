const redis = require('redis');
const redis_client = redis.createClient();

redis_client.on('error', (err) => console.error('Redis error:', err));


module.exports = { redis_client };