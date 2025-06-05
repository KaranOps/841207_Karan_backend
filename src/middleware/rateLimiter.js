const redisClient = require('../utils/redisClient');

const rateLimiter = async (req, res, next)=>{
    const ip = req.ip;                // Get requestor's IP address
    const key = `rate:${ip}`;         // Create unique Redis key for this IP
    const requests = await redisClient.incr(key);
    
    if (requests === 1) {
    await redisClient.expire(key, 60); // 60 seconds window
  }
    if (requests > 30) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.' });
  }
  next();
};

module.exports = rateLimiter;