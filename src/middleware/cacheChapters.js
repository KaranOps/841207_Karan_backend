const redisClient = require('../utils/redisClient');

const cacheChapters = async (req, res, next) => {
    // Generate unique cache key based on query parameters
    const key = `chapters:${JSON.stringify(req.query)}`;
    
    // Check if data exists in cache
    const cached = await redisClient.get(key);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    // If not in cache, attach cache key to response locals 
    res.locals.cacheKey = key;
    next();
};

module.exports = cacheChapters;