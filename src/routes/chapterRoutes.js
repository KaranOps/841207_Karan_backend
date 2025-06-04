const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload')

const {uploadChapters } = require('../controllers/chapterController'); 
const { verifyAdmin } = require('../middleware/adminAuth');



router.post('/upload', verifyAdmin, upload.single('jsonFile'), uploadChapters);

module.exports = router;