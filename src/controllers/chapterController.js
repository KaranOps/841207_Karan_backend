const Chapter = require('../models/chapterSchema');

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
    // if (insertedChapters.length > 0) {
    //   // TODO: Add Redis cache invalidation here
    //   // await redis.del('chapters:all');
    // }

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