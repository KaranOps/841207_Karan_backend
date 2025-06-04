const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload')

const {uploadChapters, getChapters, getChapterById, getChapterByName } = require('../controllers/chapterController'); 
const { verifyAdmin } = require('../middleware/adminAuth');


router.get('/', getChapters);
router.post('/upload', verifyAdmin, upload.single('jsonFile'), uploadChapters);
router.get('/:id', getChapterById);
router.get('/search/:term', getChapterByName);

module.exports = router;