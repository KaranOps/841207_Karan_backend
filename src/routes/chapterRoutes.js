const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload')

const {uploadChapters, getChapters, getChapterById, getChapterByName } = require('../controllers/chapterController'); 
const { verifyAdmin } = require('../middleware/adminAuth');
const cacheChapters = require('../middleware/cacheChapters');

router.get('/', cacheChapters, getChapters);
router.post('/upload', verifyAdmin, upload.single('jsonFile'), uploadChapters);
router.get('/:id', getChapterById);
router.get('/search/:term', getChapterByName);

module.exports = router;