const Chapter = require('../models/chapterSchema');
const redisClient  = require('../utils/redisClient');

exports.uploadChapters = async (req, res, next) => {
    try {
        // Check if file is uploaded
        if (!req.file) {
            const error = new Error('No JSON file uploaded');
            error.statusCode = 400;
            throw error;
        }

        // Parse JSON file
        let chapters;
        try {
            const data = req.file.buffer.toString('utf8');
            chapters = JSON.parse(data);
        } catch (err) {
            const error = new Error('Invalid JSON format');
            error.statusCode = 400;
            throw error;
        }

        // Check if chapters is an array
        if (!Array.isArray(chapters)) {
            const error = new Error('JSON file must contain an array of chapters');
            error.statusCode = 400;
            throw error;
        }

        // Separate valid and invalid chapters
        const validChapters = [];
        const failedChapters = [];

        chapters.forEach((chapter, index) => {
            // Validate required fields
            if (!chapter.subject || !chapter.class || !chapter.unit || !chapter.chapter) {
                failedChapters.push({
                    index: index + 1, // index starts from 1
                    chapter: chapter,
                    reason: 'Missing required fields: subject, class, unit, or chapter'
                });
            } else {
                // Add defaults for optional fields and mark as valid
                validChapters.push({
                    ...chapter,
                    yearWiseQuestionCount: chapter.yearWiseQuestionCount || {},
                    questionSolved: chapter.questionSolved || 0,
                    status: chapter.status || 'Not Started',
                    isWeakChapter: chapter.isWeakChapter || false
                });
            }
        });

        // Insert valid chapters into database
        let insertedChapters = [];
        let insertionErrors = [];

        if (validChapters.length > 0) {
            try {
                // Use insertMany with ordered: false to continue even if some fail
                insertedChapters = await Chapter.insertMany(validChapters, { ordered: false });
            } catch (err) {
                // Handle MongoDB validation errors or duplicate key errors
                if (err.writeErrors) {
                    // Some chapters failed MongoDB validation
                    err.writeErrors.forEach((writeError, idx) => {
                        const failedChapter = validChapters[writeError.index];
                        insertionErrors.push({
                            chapter: failedChapter,
                            reason: writeError.errmsg || 'Database validation failed'
                        });
                    });
                    // Get successfully inserted chapters
                    insertedChapters = err.insertedDocs || [];
                } else {
                    throw err; // Re-throw if different error
                }
            }
        }

        // Combine all failed chapters (validation + insertion failures)
        const allFailedChapters = [...failedChapters, ...insertionErrors];

        // Invalidate cache when new chapters are added
        // After successful insertMany or other DB operation
        if (insertedChapters.length > 0) {
            const keys = await redisClient.keys('chapters*');
            for (const key of keys) {
                await redisClient.del(key);
            }
        }

        // Return response with success and failure details
        res.status(insertedChapters.length > 0 ? 201 : 400).json({
            success: insertedChapters.length > 0,
            message: `${insertedChapters.length} chapters uploaded successfully${allFailedChapters.length > 0 ? `, ${allFailedChapters.length} failed` : ''}`,
            uploadedCount: insertedChapters.length,
            failedCount: allFailedChapters.length,
            uploadedChapters: insertedChapters,
            failedChapters: allFailedChapters.length > 0 ? allFailedChapters : undefined
        });

    } catch (err) {
        next(err); // Pass error to error handler
    }
};

exports.getChapters = async (req, res, next) => {
    try {
        // Build filter object from query params
        const filter = {};
        if (req.query.class) filter.class = req.query.class;
        if (req.query.unit) filter.unit = req.query.unit;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.weakChapters) filter.isWeakChapter = req.query.weakChapters === 'true';
        if (req.query.subject) filter.subject = req.query.subject;

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Query database
        const totalChapters = await Chapter.countDocuments(filter);
        const chapters = await Chapter.find(filter).skip(skip).limit(limit);

        // Prepare response object
        const responseData = {
            success: true,
            totalChapters,
            page,
            limit,
            totalPages: Math.ceil(totalChapters / limit),
            chapters
        };

        // Cache the response if caching key exists
        if (res.locals.cacheKey) {
            await redisClient.setEx(
                res.locals.cacheKey,   // Cache key
                3600,                  // TTL: 1 hour
                JSON.stringify(responseData)
            );
        }

        // Send response
        res.json(responseData);

    } catch (err) {
        next(err);
    }
};


//Search by chapter id
exports.getChapterById = async (req, res, next) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            const error = new Error('Chapter not found');
            err.statusCode = 404;
            throw error;
        }
        res.json({ success: true, chapter });
    } catch (err) {
        // invalid ObjectId format
        if (err.kind === 'ObjectId') {
            err.statusCode = 400;
            err.message = 'Invalid chapter ID';
        }
        next(err);
    }
};

// Search by chapter name 
exports.getChapterByName = async (req, res, next) => {
    try {
        const { term } = req.params;
        if (!term) {
            const error = new Error('Search term is required');
            error.statusCode = 400;
            throw error;
        }

        // Search for chapters where the chapter name contains the term (case-insensitive)
        const chapters = await Chapter.find({
            chapter: { $regex: term, $options: 'i' }
        });

        if (!chapters.length) {
            return res.status(404).json({ success: false, message: 'No chapters found' });
        }

        res.json({ success: true, chapters });
    } catch (err) {
        next(err);
    }
};