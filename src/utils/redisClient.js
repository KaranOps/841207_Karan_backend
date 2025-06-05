const redis = require('redis');
const client = redis.createClient(); // Defaults to localhost:6379

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();

module.exports = client;