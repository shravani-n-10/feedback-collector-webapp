const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
        default: 'General'
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    category: {
        type: String,
        enum: ['Bug', 'Feature Request', 'UI/UX', 'Performance', 'Other'],
        default: 'Other'
    },
    imageUrl: {
        type: String,
        default: ''
    },
    sentiment: {
        score: { type: Number, default: 0 },
        label: { type: String, enum: ['Positive', 'Neutral', 'Negative'], default: 'Neutral' }
    }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
