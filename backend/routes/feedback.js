const express = require('express');
const router = express.Router();
const { getFeedback, createFeedback, getStats } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/').get(getFeedback).post(protect, upload.single('image'), createFeedback);
router.route('/stats').get(getStats);

module.exports = router;
