const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/download', videoController.downloadVideo);

module.exports = router;
