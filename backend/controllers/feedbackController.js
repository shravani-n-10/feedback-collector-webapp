const Feedback = require('../models/Feedback');
const Sentiment = require('sentiment');
const sentimentAnalyzer = new Sentiment();

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
const getFeedback = async (req, res) => {
    try {
        // Build query based on filters
        const { search, rating, sort } = req.query;
        let queryOptions = {};

        if (search) {
            queryOptions.name = { $regex: search, $options: 'i' };
        }
        if (rating) {
            queryOptions.rating = rating;
        }

        // Determine sort order
        let sortOption = { createdAt: -1 }; // latest default
        if (sort === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sort === 'rating_high') {
            sortOption = { rating: -1 };
        } else if (sort === 'rating_low') {
            sortOption = { rating: 1 };
        } else if (sort === 'topic_asc') {
            sortOption = { topic: 1 };
        } else if (sort === 'topic_desc') {
            sortOption = { topic: -1 };
        }

        const feedbacks = await Feedback.find(queryOptions)
            .populate('user', 'name')
            .sort(sortOption);

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
    try {
        const { name, message, rating, category, topic } = req.body;
        
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path; // Cloudinary URL
        }

        // AI Sentiment Analysis
        const analysis = sentimentAnalyzer.analyze(message);
        let sentimentLabel = 'Neutral';
        if (analysis.score > 1) {
            sentimentLabel = 'Positive';
        } else if (analysis.score < -1) {
            sentimentLabel = 'Negative';
        }

        const feedback = await Feedback.create({
            user: req.user._id,
            name,
            topic: topic || 'General',
            message,
            rating: Number(rating),
            category,
            imageUrl,
            sentiment: {
                score: analysis.score,
                label: sentimentLabel
            }
        });

        // Trigger Socket.io event globally!
        const reqIo = req.app.get('io');
        if (reqIo) {
            const populatedFeedback = await Feedback.findById(feedback._id).populate('user', 'name');
            reqIo.emit('new_feedback', populatedFeedback);
        }

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/feedback/stats
// @access  Public
const getStats = async (req, res) => {
    try {
        const stats = await Feedback.aggregate([
            {
                $group: {
                    _id: null,
                    totalFeedbacks: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    positiveCount: {
                        $sum: { $cond: [ { $eq: ['$sentiment.label', 'Positive'] }, 1, 0 ] }
                    },
                    negativeCount: {
                        $sum: { $cond: [ { $eq: ['$sentiment.label', 'Negative'] }, 1, 0 ] }
                    },
                    neutralCount: {
                        $sum: { $cond: [ { $eq: ['$sentiment.label', 'Neutral'] }, 1, 0 ] }
                    }
                }
            }
        ]);

        if (stats.length > 0) {
            res.json(stats[0]);
        } else {
            res.json({ totalFeedbacks: 0, avgRating: 0, positiveCount: 0, negativeCount: 0, neutralCount: 0 });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFeedback, createFeedback, getStats };
